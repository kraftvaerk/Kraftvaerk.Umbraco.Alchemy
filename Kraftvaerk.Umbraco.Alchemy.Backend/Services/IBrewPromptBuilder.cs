using Kraftvaerk.Umbraco.Alchemy.Backend.Models;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services
{
    public interface IBrewPromptBuilder
    {
        Task<string> BuildPropertyContextPrompt(BrewPropertyContext pc);
        string BuildUfmContextPrompt(BrewPropertyContext pc);
        string BuildIconContextPrompt(BrewPropertyContext pc);
    }
}
