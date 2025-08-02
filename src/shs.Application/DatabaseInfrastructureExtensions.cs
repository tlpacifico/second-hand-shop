using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using shs.Application.Abstractions.Behaviors;
using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment;
using shs.Domain.Application;

namespace shs.Application;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register existing services
        services.AddScoped<IConsignmentService, ConsignmentService>();

        // Register handlers automatically
        services.Scan(scan => scan.FromAssembliesOf(typeof(ApplicationServiceCollectionExtensions))
            .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), publicOnly: false)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), publicOnly: false)
            .AsImplementedInterfaces()
            .WithScopedLifetime()
            .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<,>)), publicOnly: false)
            .AsImplementedInterfaces()
            .WithScopedLifetime());

        // Add decorators for cross-cutting concerns
        services.Decorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));
        services.Decorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));
        services.Decorate(typeof(ICommandHandler<,>), typeof(ValidationDecorator.CommandHandler<,>));

        return services;
    }
}
