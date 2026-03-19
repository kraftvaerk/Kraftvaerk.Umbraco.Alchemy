using Kraftvaerk.Umbraco.Alchemy.Backend.Models;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services
{
    public interface IBrewService
    {
        void CacheContext(string key, BrewPropertyContext context);
        Task<BrewResponseModel> BrewAsync(BrewRequestModel request, CancellationToken cancellationToken = default);
    }
}
