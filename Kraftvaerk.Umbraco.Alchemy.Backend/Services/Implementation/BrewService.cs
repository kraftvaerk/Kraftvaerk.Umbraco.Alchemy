using Kraftvaerk.Umbraco.Alchemy.Backend.Models;
using Kraftvaerk.Umbraco.Alchemy.Backend.Options;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Umbraco.AI.Core.Chat;
using Umbraco.AI.Core.Contexts;
using Umbraco.AI.Core.InlineChat;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation
{
    public class BrewService : IBrewService
    {
        private readonly IAIChatService _chatService;
        private readonly IAIContextService _contextService;
        private readonly IAIContextProcessor _contextProcessor;
        private readonly IBrewPromptBuilder _promptBuilder;
        private readonly IMemoryCache _cache;
        private readonly IContentTypeService _contentTypeService;
        private readonly IOptions<AlchemyOptions> _alchemyOptions;

        public BrewService(
            IAIChatService chatService,
            IAIContextService contextService,
            IAIContextProcessor contextProcessor,
            IBrewPromptBuilder promptBuilder,
            IMemoryCache cache,
            IContentTypeService contentTypeService,
            IOptions<AlchemyOptions> alchemyOptions)
        {
            _chatService = chatService;
            _contextService = contextService;
            _contextProcessor = contextProcessor;
            _promptBuilder = promptBuilder;
            _cache = cache;
            _alchemyOptions = alchemyOptions;
            _contentTypeService = contentTypeService;
        }

        public void CacheContext(string key, BrewPropertyContext context)
        {
            _cache.Set($"alchemy:ctx:{key}", context, TimeSpan.FromHours(24));
        }

        public async Task<BrewResponseModel> BrewAsync(BrewRequestModel request, CancellationToken cancellationToken = default)
        {
            var messages = new List<ChatMessage>();

            // Enrich with context resources as a system prompt when an alias is given.
            var contextAlias = ResolveContextAlias(request.ContextAlias);
            if (!string.IsNullOrWhiteSpace(contextAlias))
            {
                var context = await _contextService.GetContextByAliasAsync(contextAlias, cancellationToken);

                if (context?.Resources.Count > 0)
                {
                    // Map AIContextResource → AIResolvedResource so the processor can handle them.
                    var resolvedResources = context.Resources
                        .Select(r => new AIResolvedResource
                        {
                            Id = r.Id,
                            ResourceTypeId = r.ResourceTypeId,
                            Name = r.Name,
                            Description = r.Description,
                            Settings = r.Settings,
                            InjectionMode = r.InjectionMode,
                            Source = "Alchemy",
                            ContextName = context.Name,
                        })
                        .ToList();

                    var resolvedContext = new AIResolvedContext
                    {
                        InjectedResources = resolvedResources
                            .Where(r => r.InjectionMode == AIContextResourceInjectionMode.Always)
                            .ToList(),
                        OnDemandResources = resolvedResources
                            .Where(r => r.InjectionMode == AIContextResourceInjectionMode.OnDemand)
                            .ToList(),
                        AllResources = resolvedResources,
                    };

                    var systemPrompt = await _contextProcessor.ProcessContextForLlmAsync(resolvedContext, cancellationToken);
                    if (!string.IsNullOrWhiteSpace(systemPrompt))
                        messages.Add(new ChatMessage(ChatRole.System, systemPrompt));
                }
            }

            // Inject the live document type context as a second system message.
            // Resolve from direct payload or fall back to the shared cache.
            var pc = request.PropertyContext
                     ?? (request.CacheKey is { } ck ? _cache.Get<BrewPropertyContext>($"alchemy:ctx:{ck}") : null);

            // Last ditch effort:� the cache key should match a content-type GUID.
            // Build a BrewPropertyContext from the content type definition itself.
            if (pc is null
                && Guid.TryParse(request.CacheKey, out var contentTypeKey)
                && _contentTypeService.Get(contentTypeKey) is { } ct)
            {
                pc = new BrewPropertyContext
                {
                    DocumentTypeName = ct.Name ?? string.Empty,
                    DocumentTypeAlias = ct.Alias,
                    DocumentTypeDescription = ct.Description,
                    IsElementType = ct.IsElement,
                    AllProperties = ct.PropertyTypes.Select(pt => new BrewPropertyInfo
                        {
                            Name = pt.Name ?? string.Empty,
                            Alias = pt.Alias,
                            Description = pt.Description,
                            EditorAlias = pt.PropertyEditorAlias,
                        })
                        .ToList(),
                };
            }

            if (pc is not null)
            {
                // Allow the request to override the cached target property alias
                // so a generic observer cache entry can be specialised per-property.
                if (!string.IsNullOrWhiteSpace(request.TargetPropertyAlias))
                {
                    pc.TargetPropertyAlias = request.TargetPropertyAlias;
                    // Also set the name from the allProperties list when available.
                    var matchingProp = pc.AllProperties.FirstOrDefault(
                        p => string.Equals(p.Alias, request.TargetPropertyAlias, StringComparison.OrdinalIgnoreCase));
                    if (matchingProp is not null)
                    {
                        pc.TargetPropertyName = matchingProp.Name;
                        pc.TargetPropertyContainerName = matchingProp.ContainerName;
                        pc.TargetPropertyContainerType = matchingProp.ContainerType;
                    }
                }

                // Choose the right template based on context alias.
                var opts = _alchemyOptions.Value;
                var isUfm = string.Equals(contextAlias, opts.Contexts.UfmWriter, StringComparison.OrdinalIgnoreCase);
                var isIcon = string.Equals(contextAlias, opts.Contexts.ContentTypeIconWriter, StringComparison.OrdinalIgnoreCase);
                string contextPrompt;
                if (isUfm)
                    contextPrompt = await _promptBuilder.BuildUfmContextPrompt(pc);
                else if (isIcon)
                    contextPrompt = _promptBuilder.BuildIconContextPrompt(pc);
                else
                    contextPrompt = await _promptBuilder.BuildPropertyContextPrompt(pc);
                messages.Add(new ChatMessage(ChatRole.System, contextPrompt));
            }

            // Combine all system messages into a single system message.
            var systemParts = messages
                .Where(m => m.Role == ChatRole.System)
                .Select(m => m.Text)
                .Where(t => !string.IsNullOrWhiteSpace(t))
                .ToList();
            messages.Clear();
            if (systemParts.Count > 0)
                messages.Add(new ChatMessage(ChatRole.System, string.Join("\n\n", systemParts)));

            messages.Add(new ChatMessage(ChatRole.User, request.Prompt));

            var profileAlias = _alchemyOptions.Value.ChatProfileAlias;
            var response = await _chatService.GetChatResponseAsync(
                chat =>
                {
                    chat.WithAlias("alchemy-brew");
                    if (!string.IsNullOrWhiteSpace(profileAlias))
                        chat.WithProfile(profileAlias);
                },
                messages,
                cancellationToken);

            return new BrewResponseModel { Result = response.Text ?? string.Empty };
        }

        /// <summary>
        /// Maps the incoming context alias from the frontend to the configured
        /// alias from <see cref="AlchemyOptions.Contexts"/>. This allows the
        /// frontend to keep sending the well-known aliases while the actual
        /// Umbraco AI context can be overridden via appsettings.
        /// </summary>
        private string? ResolveContextAlias(string? alias)
        {
            if (string.IsNullOrWhiteSpace(alias)) return null;

            var contexts = _alchemyOptions.Value.Contexts;
            // Map well-known frontend aliases to the configured ones.
            return alias switch
            {
                "ufm" => contexts.UfmWriter,
                "property-descriptions" => contexts.PropertyTypeDescriptionWriter,
                "document-type-descriptions" => contexts.ContentTypeDescriptionWriter,
                "content-type-icons" => contexts.ContentTypeIconWriter,
                _ => alias, // Pass through unknown aliases unchanged.
            };
        }
    }
}
