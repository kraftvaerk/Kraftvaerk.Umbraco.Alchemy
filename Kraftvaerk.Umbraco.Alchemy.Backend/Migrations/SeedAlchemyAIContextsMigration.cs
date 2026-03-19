using System.Reflection;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Migrations;

/// <summary>
/// Seeds the three Umbraco AI contexts used by Alchemy (ufm, property-descriptions,
/// document-type-descriptions) with text resources loaded from embedded .md templates.
/// Skips any context whose alias already exists.
/// </summary>
public class SeedAlchemyAIContextsMigration : AsyncMigrationBase
{
    private static readonly (string Alias, string Name, string ResourceName, string TemplateResource)[] Contexts =
    [
        ("ufm", "UFM", "UFM-Context", "ufm.md"),
        ("property-descriptions", "Property Descriptions", "Text", "property-descriptions.md"),
        ("document-type-descriptions", "Document Type Descriptions", "Text", "document-type-descriptions.md"),
        ("content-type-icons", "Content Type Icons", "Icon-List", "content-type-icons.md"),
    ];

    public SeedAlchemyAIContextsMigration(IMigrationContext context) : base(context) { }

    protected override Task MigrateAsync()
    {
        if (!TableExists("umbracoAIContext"))
        {
            Logger.LogWarning("Umbraco.AI tables not found — skipping AI context seeding. Is Umbraco.AI installed?");
            return Task.CompletedTask;
        }

        var now = DateTime.UtcNow.ToString("o");

        foreach (var (alias, name, resourceName, templateResource) in Contexts)
        {
            // Skip if context already exists
            if (ContextAliasExists(alias))
            {
                Logger.LogDebug("AI context '{Alias}' already exists — skipping", alias);
                continue;
            }

            var contextId = Guid.NewGuid().ToString("D").ToUpperInvariant();
            var resourceId = Guid.NewGuid().ToString("D").ToUpperInvariant();
            var content = ReadTemplate(templateResource);
            var dataJson = JsonSerializer.Serialize(new { content });

            Insert.IntoTable("umbracoAIContext").Row(new
            {
                Id = contextId,
                Alias = alias,
                Name = name,
                DateCreated = now,
                DateModified = now,
                Version = 1,
            }).Do();

            Insert.IntoTable("umbracoAIContextResource").Row(new
            {
                Id = resourceId,
                ContextId = contextId,
                ResourceTypeId = "text",
                Name = resourceName,
                SortOrder = 0,
                Data = dataJson,
                InjectionMode = 0, // Always
            }).Do();

            Logger.LogInformation("Seeded AI context '{Alias}' with resource '{ResourceName}'", alias, resourceName);
        }

        return Task.CompletedTask;
    }

    private bool ContextAliasExists(string alias)
    {
        var rows = Database.Fetch<dynamic>(
            "SELECT 1 FROM umbracoAIContext WHERE Alias = @0", alias);
        return rows.Count > 0;
    }

    private static string ReadTemplate(string fileName)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resourceName = assembly.GetManifestResourceNames()
            .FirstOrDefault(n => n.EndsWith($"Contexts.{fileName}", StringComparison.Ordinal))
            ?? throw new InvalidOperationException(
                $"Embedded resource 'Contexts/{fileName}' not found. Available: {string.Join(", ", assembly.GetManifestResourceNames())}");
        using var stream = assembly.GetManifestResourceStream(resourceName)!;
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
