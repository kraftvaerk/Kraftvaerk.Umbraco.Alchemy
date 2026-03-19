using System.ComponentModel.DataAnnotations;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Models
{
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

        /// <summary>
        /// The alias of the property being targeted. When provided, this overrides
        /// the <see cref="BrewPropertyContext.TargetPropertyAlias"/> in the cached context
        /// so the observer's generic cache entry can be specialised per-property.
        /// </summary>
        public string? TargetPropertyAlias { get; set; }
    }

    /// <summary>Document type context sent from the frontend when generating property descriptions.</summary>
    public class BrewPropertyContext
    {
        public string DocumentTypeName { get; set; } = string.Empty;
        public string? DocumentTypeAlias { get; set; }
        public string? DocumentTypeDescription { get; set; }
        public bool IsElementType { get; set; }
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
        public string? EditorAlias { get; set; }
    }

    /// <summary>Response model for the /brew endpoint.</summary>
    public class BrewResponseModel
    {
        public string Result { get; set; } = string.Empty;
    }
}
