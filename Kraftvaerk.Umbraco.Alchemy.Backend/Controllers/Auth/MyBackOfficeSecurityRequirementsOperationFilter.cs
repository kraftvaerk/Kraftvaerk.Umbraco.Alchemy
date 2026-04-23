using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Controllers.Auth
{
    internal class AlchemyBackOfficeSecurityRequirementsOperationFilter : BackOfficeSecurityRequirementsOperationFilterBase
    {
        protected override string ApiName => "Kraftvaerk.Umbraco.Alchemy-api-v1";
    }

    internal class AlchemyConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
    {
        public void Configure(SwaggerGenOptions options)
        {
            options.SwaggerDoc("Kraftvaerk.Umbraco.Alchemy-api-v1", new OpenApiInfo { Title = "Kraftvaerk.Umbraco.Alchemy v1", Version = "1.0" });
            options.OperationFilter<AlchemyBackOfficeSecurityRequirementsOperationFilter>();
        }
    }

    internal class AlchemySwaggerComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
            => builder.Services.ConfigureOptions<AlchemyConfigureSwaggerGenOptions>();
    }
}
