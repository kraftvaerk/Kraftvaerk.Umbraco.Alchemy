using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Kraftvaerk.Umbraco.Alchemy.Backend.Models;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Web.Common.AspNetCore;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation
{
    public class BrewPromptBuilder : IBrewPromptBuilder
    {
        internal const string ContentTypesCacheKey = "alchemy:contenttypes";
        internal const string DataTypesCacheKey = "alchemy:datatypes";

        private readonly IContentTypeService _contentTypeService;
        private readonly IDataTypeService _dataTypeService;
        private readonly IMemoryCache _cache;

        public BrewPromptBuilder(IDataTypeService dataTypeService, IContentTypeService contentTypeService, IMemoryCache cache)
        {
            _contentTypeService = contentTypeService;
            _dataTypeService = dataTypeService;
            _cache = cache;
        }

        private static readonly Lazy<string> PropertyContextTemplate = new(() =>
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = assembly.GetManifestResourceNames()
                .First(n => n.EndsWith("PropertyContextPrompt.md", StringComparison.Ordinal));
            using var stream = assembly.GetManifestResourceStream(resourceName)!;
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        });

        private static readonly Lazy<string> UfmContextTemplate = new(() =>
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resourceName = assembly.GetManifestResourceNames()
                .First(n => n.EndsWith("UfmContextPrompt.md", StringComparison.Ordinal));
            using var stream = assembly.GetManifestResourceStream(resourceName)!;
            using var reader = new StreamReader(stream);
            return reader.ReadToEnd();
        });

        public async Task<string> BuildPropertyContextPrompt(BrewPropertyContext pc)
        {
            var cachedContentTypes = await _cache.GetOrCreateAsync(ContentTypesCacheKey, _ =>
                Task.FromResult(_contentTypeService.GetAll().ToList()));

            var contentTypeNames = cachedContentTypes?.ToDictionary(x => x.Key.ToString(), x => x.Name);

            var dataTypes = await _cache.GetOrCreateAsync(DataTypesCacheKey, async _ =>
            {
                var all = await _dataTypeService.GetAllAsync();
                return all.ToDictionary(x => x.Key, x => x);
            });

            string dataTypeConfiguration = string.Empty;
            if (!string.IsNullOrWhiteSpace(pc.DocumentTypeAlias) && !string.IsNullOrEmpty(pc.TargetPropertyAlias))
            {
                var ct = cachedContentTypes?.FirstOrDefault(x => x.Alias == pc.DocumentTypeAlias);
                var dataTypeKey = ct?.PropertyTypes.FirstOrDefault(x => x.Alias == pc.TargetPropertyAlias)?.DataTypeKey;

                if (dataTypeKey.HasValue && dataTypes is not null && dataTypes.TryGetValue(dataTypeKey.Value, out var dt))
                {
                    var json = JsonConvert.SerializeObject(dt.ConfigurationObject);
                    json = Regex.Replace(json, @"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
                        match => contentTypeNames is not null && contentTypeNames.TryGetValue(match.Value, out var name) && name is not null ? name : match.Value);
                    dataTypeConfiguration = $"EditorAlias: {dt.EditorAlias} | Configuration: {json}";
                }
            }
            

            var description = string.IsNullOrWhiteSpace(pc.DocumentTypeDescription)
                ? string.Empty
                : $"\n{pc.DocumentTypeDescription}\n";

            var elementTypeHint = pc.IsElementType
                ? "This is an **element type** (used as a block inside Block List / Block Grid editors). Refer to it as a \"block\" rather than a \"page\" or \"document\"."
                : "This is NOT an **element type**. It is a normal document-type. Refer to it as a \"page\" or \"document\" rather than a \"block\".";

            var dataTypeConfigSection = !string.IsNullOrWhiteSpace(dataTypeConfiguration)
                ? $"Data type configuration: `{dataTypeConfiguration}`"
                : string.Empty;

            string preamble;
            string targetSection;

            if (string.IsNullOrWhiteSpace(pc.TargetPropertyAlias))
            {
                preamble = $"You are writing a document type description inside the Umbraco backoffice for: **{pc.DocumentTypeName}**";
                targetSection = $"Write a description for this document type.";
            }
            else
            {
                preamble = $"You are writing a property description inside the Umbraco backoffice for document type: **{pc.DocumentTypeName}**";

                var target = !string.IsNullOrWhiteSpace(pc.TargetPropertyName)
                    ? $"Write a description for: **{pc.TargetPropertyName}** (alias: `{pc.TargetPropertyAlias}`)"
                    : $"Write a description for the property with alias: `{pc.TargetPropertyAlias}`";

                var container = !string.IsNullOrWhiteSpace(pc.TargetPropertyContainerName)
                    ? $"\nLocated in: {pc.TargetPropertyContainerType ?? "Group"} \"{pc.TargetPropertyContainerName}\""
                    : string.Empty;

                targetSection = $"## Target Property\n{target}{container}{(string.IsNullOrWhiteSpace(dataTypeConfigSection) ? string.Empty : $"\n{dataTypeConfigSection}")}";
            }

            var propertiesTable = pc.AllProperties.Count > 0
                ? BuildPropertiesTable(pc.AllProperties)
                : string.Empty;

            return PropertyContextTemplate.Value
                .Replace("{{Preamble}}", preamble)
                .Replace("{{DocumentTypeDescription}}", description)
                .Replace("{{ElementTypeHint}}", elementTypeHint)
                .Replace("{{TargetSection}}", targetSection)
                .Replace("{{PropertiesTable}}", propertiesTable);
        }

        public string BuildUfmContextPrompt(BrewPropertyContext pc)
        {
            var description = string.IsNullOrWhiteSpace(pc.DocumentTypeDescription)
                ? string.Empty
                : $"\n{pc.DocumentTypeDescription}\n";

            var propertiesTable = pc.AllProperties.Count > 0
                ? BuildAliasOnlyTable(pc.AllProperties)
                : string.Empty;

            return UfmContextTemplate.Value
                .Replace("{{DocumentTypeName}}", pc.DocumentTypeName)
                .Replace("{{DocumentTypeDescription}}", description)
                .Replace("{{PropertiesTable}}", propertiesTable);
        }

        private static string BuildPropertiesTable(List<BrewPropertyInfo> properties)
        {
            var sb = new StringBuilder();
            sb.AppendLine("## All Properties in This Document Type");
            sb.AppendLine("| Property | Alias | Location | Current Description |");
            sb.AppendLine("|----------|-------|----------|---------------------|");
            foreach (var prop in properties)
            {
                var location = string.IsNullOrWhiteSpace(prop.ContainerName)
                    ? "\u2014"
                    : $"{prop.ContainerType ?? "Group"}: {prop.ContainerName}";
                var desc = string.IsNullOrWhiteSpace(prop.Description) ? "\u2014" : prop.Description;
                sb.AppendLine($"| {prop.Name} | `{prop.Alias}` | {location} | {desc} |");
            }
            return sb.ToString();
        }

        private static string BuildAliasOnlyTable(List<BrewPropertyInfo> properties)
        {
            var sb = new StringBuilder();
            sb.AppendLine("| Property | Alias |");
            sb.AppendLine("|----------|-------|");
            foreach (var prop in properties)
            {
                sb.AppendLine($"| {prop.Name} | `{prop.Alias}` |");
            }
            return sb.ToString();
        }
    }
}
