namespace Kraftvaerk.Umbraco.Alchemy.Backend.Models;

/// <summary>Response model exposing Alchemy configuration to the frontend.</summary>
public class AlchemyOptionsResponseModel
{
    /// <summary>
    /// Whether the experimental inline brew buttons are enabled.
    /// </summary>
    public bool ExperimentalButtons { get; set; }
}
