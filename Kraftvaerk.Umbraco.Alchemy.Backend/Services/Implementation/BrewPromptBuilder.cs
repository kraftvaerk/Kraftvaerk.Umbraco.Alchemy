using System.Reflection;
using System.Text;
using Kraftvaerk.Umbraco.Alchemy.Backend.Models;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation
{
    public class BrewPromptBuilder : IBrewPromptBuilder
    {
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

        public string BuildPropertyContextPrompt(BrewPropertyContext pc)
        {
            var description = string.IsNullOrWhiteSpace(pc.DocumentTypeDescription)
                ? string.Empty
                : $"\n{pc.DocumentTypeDescription}\n";

            var elementTypeHint = pc.IsElementType
                ? "This is an **element type** (used as a block inside Block List / Block Grid editors). Refer to it as a \"block\" rather than a \"page\" or \"document\"."
                : "This is NOT an **element type**. It is a normal document-type. Refer to it as a \"page\" or \"document\" rather than a \"block\".";

            var targetSection = !string.IsNullOrWhiteSpace(pc.TargetPropertyName)
                ? $"Write a description for: **{pc.TargetPropertyName}** (alias: `{pc.TargetPropertyAlias}`)"
                : $"Write a description for the property with alias: `{pc.TargetPropertyAlias}`";

            var container = !string.IsNullOrWhiteSpace(pc.TargetPropertyContainerName)
                ? $"Located in: {pc.TargetPropertyContainerType ?? "Group"} \"{pc.TargetPropertyContainerName}\""
                : string.Empty;

            var propertiesTable = pc.AllProperties.Count > 0
                ? BuildPropertiesTable(pc.AllProperties)
                : string.Empty;

            return PropertyContextTemplate.Value
                .Replace("{{DocumentTypeName}}", pc.DocumentTypeName)
                .Replace("{{DocumentTypeDescription}}", description)
                .Replace("{{ElementTypeHint}}", elementTypeHint)
                .Replace("{{TargetPropertySection}}", targetSection)
                .Replace("{{TargetPropertyContainer}}", container)
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
