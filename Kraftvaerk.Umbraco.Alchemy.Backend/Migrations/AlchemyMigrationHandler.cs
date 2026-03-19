using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Migrations;

/// <summary>
/// Runs Alchemy migrations on application startup.
/// </summary>
public class AlchemyMigrationHandler : INotificationAsyncHandler<UmbracoApplicationStartedNotification>
{
    private readonly IMigrationPlanExecutor _migrationPlanExecutor;
    private readonly ICoreScopeProvider _coreScopeProvider;
    private readonly IKeyValueService _keyValueService;
    private readonly IRuntimeState _runtimeState;
    private readonly ILogger<AlchemyMigrationHandler> _logger;

    public AlchemyMigrationHandler(
        ICoreScopeProvider coreScopeProvider,
        IMigrationPlanExecutor migrationPlanExecutor,
        IKeyValueService keyValueService,
        IRuntimeState runtimeState,
        ILogger<AlchemyMigrationHandler> logger)
    {
        _migrationPlanExecutor = migrationPlanExecutor;
        _coreScopeProvider = coreScopeProvider;
        _keyValueService = keyValueService;
        _runtimeState = runtimeState;
        _logger = logger;
    }

    public async Task HandleAsync(UmbracoApplicationStartedNotification notification, CancellationToken cancellationToken)
    {
        if (_runtimeState.Level < RuntimeLevel.Run)
            return;

        try
        {
            _logger.LogInformation("Starting Alchemy migrations");

            var migrationPlan = new MigrationPlan("Alchemy");

            migrationPlan.From(string.Empty)
                .To<SeedAlchemyAIContextsMigration>("alchemy-ai-contexts-seeded");

            var upgrader = new Upgrader(migrationPlan);
            await upgrader.ExecuteAsync(
                _migrationPlanExecutor,
                _coreScopeProvider,
                _keyValueService);

            _logger.LogInformation("Alchemy migrations completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to execute Alchemy migrations");
            throw;
        }
    }
}
