using Microsoft.EntityFrameworkCore;

namespace shs.Api.Infrastructure.Database;

public class ShsDbContext (DbContextOptions<ShsDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ShsDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}