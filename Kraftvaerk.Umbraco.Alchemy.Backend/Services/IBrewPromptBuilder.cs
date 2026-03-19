using Kraftvaerk.Umbraco.Alchemy.Backend.Models;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services
{
    public interface IBrewPromptBuilder
    {
        string BuildPropertyContextPrompt(BrewPropertyContext pc);
        string BuildUfmContextPrompt(BrewPropertyContext pc);
    }
}
