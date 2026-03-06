using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Caching.Memory;
using System.ComponentModel.DataAnnotations;
using Umbraco.AI.Core.Chat;
using Umbraco.Cms.Core;
using Umbraco.AI.Core.Contexts;
using Umbraco.AI.Core.Profiles;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Web.Common.Authorization;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("Kraftvaerk.Umbraco.Alchemy-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/Kraftvaerk.Umbraco.Alchemy")]
    public class BrewController : Controller
    {
        private readonly IAIChatService _chatService;
        private readonly IAIContextService _contextService;
        private readonly IAIContextFormatter _contextFormatter;
        private readonly IAIProfileService _profileService;
        private readonly IMemoryCache _cache;

        public BrewController(
            IAIChatService chatService,
            IAIContextService contextService,
            IAIContextFormatter contextFormatter,
            IAIProfileService profileService,
            IMemoryCache cache)
        {
            _chatService = chatService;
            _contextService = contextService;
            _contextFormatter = contextFormatter;
            _profileService = profileService;
            _cache = cache;
        }

        /// <summary>
        /// Caches property context for a document type so that elements which cannot
        /// resolve the workspace context themselves can still benefit from it.
        /// </summary>
        [HttpPost("brew/context/{key}")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult CacheContext(
            string key,
            [FromBody] BrewPropertyContext context)
        {
            _cache.Set($"alchemy:ctx:{key}", context, TimeSpan.FromHours(24));
            return NoContent();
        }

        /// <summary>
        /// Sends a prompt to the AI, optionally enriched with a named Umbraco.AI context,
        /// and returns the generated text.
        /// </summary>
        [HttpPost("brew")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(BrewResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Brew(
            [FromBody] BrewRequestModel request,
            CancellationToken cancellationToken = default)
        {
            var messages = new List<ChatMessage>();

            // Enrich with context resources as a system prompt when an alias is given.
            if (!string.IsNullOrWhiteSpace(request.ContextAlias))
            {
                var context = await _contextService.GetContextByAliasAsync(request.ContextAlias, cancellationToken);

                if (context?.Resources.Count > 0)
                {
                    // Map AIContextResource → AIResolvedResource so the formatter can process them.
                    var resolvedResources = context.Resources
                        .Select(r => new AIResolvedResource
                        {
                            Id = r.Id,
                            ResourceTypeId = r.ResourceTypeId,
                            Name = r.Name,
                            Description = r.Description,
                            Data = r.Data,
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

                    var systemPrompt = _contextFormatter.FormatContextForLlm(resolvedContext);
                    if (!string.IsNullOrWhiteSpace(systemPrompt))
                        messages.Add(new ChatMessage(ChatRole.System, systemPrompt));
                }
            }

            // Inject the live document type context as a second system message.
            // Resolve from direct payload or fall back to the shared cache.
            var pc = request.PropertyContext
                     ?? (request.CacheKey is { } ck ? _cache.Get<BrewPropertyContext>($"alchemy:ctx:{ck}") : null);
            if (pc is not null)
            {
                var sb = new System.Text.StringBuilder();
                sb.AppendLine("## Document Type Context");
                sb.Append("You are writing a property description inside the Umbraco backoffice for document type: **");
                sb.Append(pc.DocumentTypeName);
                sb.AppendLine("**");
                if (!string.IsNullOrWhiteSpace(pc.DocumentTypeDescription))
                {
                    sb.AppendLine();
                    sb.AppendLine(pc.DocumentTypeDescription);
                }

                sb.AppendLine();
                sb.AppendLine("## Target Property");
                if (!string.IsNullOrWhiteSpace(pc.TargetPropertyName))
                {
                    sb.Append("Write a description for: **");
                    sb.Append(pc.TargetPropertyName);
                    sb.Append("** (alias: `");
                    sb.Append(pc.TargetPropertyAlias);
                    sb.AppendLine("`)");
                }
                else
                {
                    sb.Append("Write a description for the property with alias: `");
                    sb.Append(pc.TargetPropertyAlias);
                    sb.AppendLine("`");
                }
                if (!string.IsNullOrWhiteSpace(pc.TargetPropertyContainerName))
                {
                    sb.Append("Located in: ");
                    sb.Append(pc.TargetPropertyContainerType ?? "Group");
                    sb.Append(" \"");
                    sb.Append(pc.TargetPropertyContainerName);
                    sb.AppendLine("\"");
                }

                if (pc.AllProperties.Count > 0)
                {
                    sb.AppendLine();
                    sb.AppendLine("## All Properties in This Document Type");
                    sb.AppendLine("| Property | Alias | Location | Current Description |");
                    sb.AppendLine("|----------|-------|----------|---------------------|");
                    foreach (var prop in pc.AllProperties)
                    {
                        var location = string.IsNullOrWhiteSpace(prop.ContainerName)
                            ? "—"
                            : $"{prop.ContainerType ?? "Group"}: {prop.ContainerName}";
                        var desc = string.IsNullOrWhiteSpace(prop.Description) ? "—" : prop.Description;
                        sb.Append("| ");
                        sb.Append(prop.Name);
                        sb.Append(" | `");
                        sb.Append(prop.Alias);
                        sb.Append("` | ");
                        sb.Append(location);
                        sb.Append(" | ");
                        sb.Append(desc);
                        sb.AppendLine(" |");
                    }
                }

                messages.Add(new ChatMessage(ChatRole.System, sb.ToString()));
            }

            messages.Add(new ChatMessage(ChatRole.User, request.Prompt));

            // Use the gpt4omini profile; fall back to the global default if not found.
            var profile = await _profileService.GetProfileByAliasAsync("gpt4omini", cancellationToken);

            ChatResponse response;
            if (profile is not null)
                response = await _chatService.GetChatResponseAsync(profile.Id, messages, cancellationToken: cancellationToken);
            else
                response = await _chatService.GetChatResponseAsync(messages, cancellationToken: cancellationToken);

            return Ok(new BrewResponseModel { Result = response.Text ?? string.Empty });
        }
    }

    /// <summary>Request model for the /brew endpoint.</summary>
    public class BrewRequestModel
    {
        [Required]
        public string Prompt { get; set; } = string.Empty;

        /// <summary>
        /// Alias of the Umbraco.AI context to inject as a system prompt.
        /// Omit to send the user prompt without any pre-configured context.
        /// </summary>
        public string? ContextAlias { get; set; }

        /// <summary>
        /// Live document type context collected from the Umbraco backoffice frontend.
        /// When present it is formatted into an additional system message so the LLM
        /// understands the document type structure it is writing for.
        /// </summary>
        public BrewPropertyContext? PropertyContext { get; set; }

        /// <summary>
        /// Cache key (typically the document type GUID from the URL) used to look up
        /// a previously cached <see cref="BrewPropertyContext"/> when the frontend
        /// element cannot resolve it directly.
        /// </summary>
        public string? CacheKey { get; set; }
    }

    /// <summary>Document type context sent from the frontend when generating property descriptions.</summary>
    public class BrewPropertyContext
    {
        public string DocumentTypeName { get; set; } = string.Empty;
        public string? DocumentTypeDescription { get; set; }
        public string TargetPropertyAlias { get; set; } = string.Empty;
        public string? TargetPropertyName { get; set; }
        public string? TargetPropertyContainerName { get; set; }
        public string? TargetPropertyContainerType { get; set; }
        public List<BrewPropertyInfo> AllProperties { get; set; } = [];
    }

    /// <summary>Single property entry inside <see cref="BrewPropertyContext"/>.</summary>
    public class BrewPropertyInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Alias { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ContainerName { get; set; }
        public string? ContainerType { get; set; }
    }

    /// <summary>Response model for the /brew endpoint.</summary>
    public class BrewResponseModel
    {
        public string Result { get; set; } = string.Empty;
    }
}
