using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;

namespace shs.Database.Database;

public class ShsDbContext (DbContextOptions<ShsDbContext> options) : IdentityDbContext<UserEntity>(options)
{
    public DbSet<ConsignmentItemEntity> ConsignmentItems { get; set; }
    public DbSet<ConsignmentSupplierEntity> ConsignmentSuppliers { get; set; }
    public DbSet<ConsignmentEntity> Consignments { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    { 
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ShsDbContext).Assembly);
        
    }
}