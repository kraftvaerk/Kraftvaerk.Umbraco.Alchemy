using Microsoft.Extensions.DependencyInjection;
using Kraftvaerk.Umbraco.Alchemy.Backend.Migrations;
using Kraftvaerk.Umbraco.Alchemy.Backend.Notifications;
using Kraftvaerk.Umbraco.Alchemy.Backend.Options;
using Kraftvaerk.Umbraco.Alchemy.Backend.Services;
using Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Composers
{
    public class ServiceComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.Configure<AlchemyOptions>(
                builder.Config.GetSection(AlchemyOptions.SectionName));

            builder.Services.AddSingleton<IBrewPromptBuilder, BrewPromptBuilder>();
            builder.Services.AddScoped<IBrewService, BrewService>();

            builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, AlchemyMigrationHandler>();
            builder.AddNotificationAsyncHandler<ContentTypeSavedNotification, DataTypeCacheClearNotificationHandler>();
            builder.AddNotificationAsyncHandler<DataTypeSavedNotification, DataTypeCacheClearNotificationHandler>();
        }
    }
}
