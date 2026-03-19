namespace Kraftvaerk.Umbraco.Alchemy.Backend.Options;

public class AlchemyOptions
{
    public const string SectionName = "Alchemy";

    /// <summary>
    /// Alias of the Umbraco AI chat profile to use. When null the default chat profile is used.
    /// </summary>
    public string? ChatProfileAlias { get; set; }

    /// <summary>
    /// Enables experimental inline brew buttons on property editors and content type headers.
    /// </summary>
    public bool ExperimentalButtons { get; set; }

    /// <summary>
    /// Context alias overrides. Each maps to an Umbraco AI context that the
    /// corresponding feature will inject as a system prompt.
    /// </summary>
    public AlchemyContextOptions Contexts { get; set; } = new();
}

public class AlchemyContextOptions
{
    /// <summary>Context alias for UFM block label generation.</summary>
    public string UfmWriter { get; set; } = "ufm";

    /// <summary>Context alias for document type description generation.</summary>
    public string ContentTypeDescriptionWriter { get; set; } = "document-type-descriptions";

    /// <summary>Context alias for property description generation.</summary>
    public string PropertyTypeDescriptionWriter { get; set; } = "property-descriptions";

    /// <summary>Context alias for content type icon selection.</summary>
    public string ContentTypeIconWriter { get; set; } = "content-type-icons";
}
