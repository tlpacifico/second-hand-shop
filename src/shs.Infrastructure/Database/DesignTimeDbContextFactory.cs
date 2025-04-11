using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using shs.Api.Infrastructure.Database;

namespace shs.Database.Database;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ShsDbContext>
{
    public ShsDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<ShsDbContext>()
            .UseNpgsql(
                "Server=localhost;Port=5432;Database=shs;Username=postgres;Password=LarLaw6emmDmezaV",
                builder => builder
                    .EnableRetryOnFailure()
            ).Options;
        return new ShsDbContext(options);
    }
}