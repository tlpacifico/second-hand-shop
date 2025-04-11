using Marlo.Common.EntityFrameworkCore.Interceptors;
using Marlo.Common.EntityFrameworkCore.Interceptors.Models;
using Marlo.Common.EntityFrameworkCore.Repositories;
using Marlo.Common.EntityFrameworkCore.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using shs.Infrastructure;

namespace shs.Database.Database;

public static class DatabaseInfrastructureExtensions
{
    public static IServiceCollection AddDatabaseInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddDatabase(configuration)
            .AddDependencyInjection();

        return services;
    }

    private static IServiceCollection AddDependencyInjection(this IServiceCollection services)
    {
        services.AddScoped(typeof(ISimpleRepository<,>), typeof(SimpleRepository<,>));
        services.AddScoped<IAuditableUserDataProvider, AuditableProvider>();
        services.AddScoped<IExternalIdGeneratorService<Guid>, ExternalIdGeneratorService>();
        services.AddScoped<UpdateExternalIdInterceptor<Guid>>();
        services.AddScoped<UpdateCreatedUpdatedPropertiesInterceptor>();
        services.AddScoped<SoftDeleteInterceptor>();
        return services;
    }

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddDbContext<ShsDbContext>((sp, options) =>
            {
                var createUpdateInterceptor = sp.GetRequiredService<UpdateCreatedUpdatedPropertiesInterceptor>();
                var externalIdInterceptor = sp.GetRequiredService<UpdateExternalIdInterceptor<Guid>>();
                var softDeleteInterceptor = sp.GetRequiredService<SoftDeleteInterceptor>();


                options.UseNpgsql(
                        configuration.GetConnectionString("Postgres"),
                        builder => builder
                            .EnableRetryOnFailure()
                    )
                    .AddInterceptors(createUpdateInterceptor, externalIdInterceptor, softDeleteInterceptor);
            });

        return services;
    }
    
    public static async Task ApplyMigrations(this IServiceScope scope)
    {
        var db = scope.ServiceProvider.GetRequiredService<ShsDbContext>();
        await db.Database.MigrateAsync();
    }
    
    public class ExternalIdGeneratorService : IExternalIdGeneratorService<Guid>
    {
        public Guid GetNewExternalId()
        {
            return Guid.NewGuid();
        }
    }
}
