using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using shs.Application.Consignment;
using shs.Domain.Application;

namespace shs.Application;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IConsignmentService, ConsignmentService>();

        return services;
    }
}
