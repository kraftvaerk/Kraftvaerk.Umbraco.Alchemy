using Asp.Versioning;
using Kraftvaerk.Umbraco.Alchemy.Backend.Models;
using Kraftvaerk.Umbraco.Alchemy.Backend.Options;
using Kraftvaerk.Umbraco.Alchemy.Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Core;
using Umbraco.Cms.Web.Common.Authorization;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [MapToApi("Kraftvaerk.Umbraco.Alchemy-api-v1")]
    [Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
    [JsonOptionsName(Constants.JsonOptionsNames.BackOffice)]
    [Route("api/v{version:apiVersion}/Kraftvaerk.Umbraco.Alchemy")]
    public class BrewController : Controller
    {
        private readonly IBrewService _brewService;
        private readonly AlchemyOptions _options;

        public BrewController(IBrewService brewService, IOptions<AlchemyOptions> options)
        {
            _brewService = brewService;
            _options = options.Value;
        }

        /// <summary>
        /// Returns the current Alchemy configuration exposed to the frontend.
        /// </summary>
        [HttpGet("options")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(AlchemyOptionsResponseModel), StatusCodes.Status200OK)]
        public IActionResult GetOptions()
        {
            return Ok(new AlchemyOptionsResponseModel
            {
                ExperimentalButtons = _options.ExperimentalButtons
            });
        }

        /// <summary>
        /// Caches property context for a document type so that elements which cannot
        /// resolve the workspace context themselves can still benefit from it.
        /// </summary>
        [HttpPost("brew/context/{key}")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult CacheContext(
            string key,
            [FromBody] BrewPropertyContext context)
        {
            _brewService.CacheContext(key, context);
            return NoContent();
        }

        /// <summary>
        /// Sends a prompt to the AI, optionally enriched with a named Umbraco.AI context,
        /// and returns the generated text.
        /// </summary>
        [HttpPost("brew")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(BrewResponseModel), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Brew(
            [FromBody] BrewRequestModel request,
            CancellationToken cancellationToken = default)
        {
            var result = await _brewService.BrewAsync(request, cancellationToken);
            return Ok(result);
        }
    }
}
