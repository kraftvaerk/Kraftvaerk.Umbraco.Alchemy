using Microsoft.Extensions.DependencyInjection;
using Kraftvaerk.Umbraco.Alchemy.Backend.Services;
using Kraftvaerk.Umbraco.Alchemy.Backend.Services.Implementation;
using Umbraco.AI.Core.Tests;
using Umbraco.Cms.Core.Composing;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Composers
{
    public class ServiceComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            // example of registering a service
            builder.Services.AddScoped<IExampleService, ExampleService>();

            // Workaround: Umbraco.AI 1.6.0 omits the AITestFeatureCollection registration
            builder.WithCollectionBuilder<AITestFeatureCollectionBuilder>();
        }
    }
}
