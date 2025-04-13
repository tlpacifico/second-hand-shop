using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;

namespace shs.Database.Database;

public class ShsDbContext (DbContextOptions<ShsDbContext> options) : IdentityDbContext<UserEntity>(options)
{
    public DbSet<ConsignmentItemEntity> ConsignmentItems { get; set; }
    public DbSet<ConsignmentSupplierEntity> ConsignmentSuppliers { get; set; }
    public DbSet<ConsignmentEntity> Consignments { get; set; }
    public DbSet<BrandEntity> Brands { get; set; }
    public DbSet<ConsignmentItemTagEntity> ConsignmentItemTags { get; set; }
    public DbSet<TagEntity> Tags { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    { 
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ShsDbContext).Assembly);
        
    }
}