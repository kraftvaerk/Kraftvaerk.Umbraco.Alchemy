using Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation;
using Microsoft.Extensions.Caching.Memory;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Notifications;

internal class DataTypeCacheClearNotificationHandler
    : INotificationAsyncHandler<ContentTypeSavedNotification>,
      INotificationAsyncHandler<DataTypeSavedNotification>
{
    private readonly IMemoryCache _cache;

    public DataTypeCacheClearNotificationHandler(IMemoryCache cache)
    {
        _cache = cache;
    }

    public Task HandleAsync(ContentTypeSavedNotification notification, CancellationToken cancellationToken)
    {
        _cache.Remove(BrewPromptBuilder.ContentTypesCacheKey);
        return Task.CompletedTask;
    }

    public Task HandleAsync(DataTypeSavedNotification notification, CancellationToken cancellationToken)
    {
        _cache.Remove(BrewPromptBuilder.DataTypesCacheKey);
        return Task.CompletedTask;
    }
}
