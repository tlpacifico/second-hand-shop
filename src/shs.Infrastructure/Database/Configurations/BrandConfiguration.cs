using Marlo.Common.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class BrandConfiguration : IEntityTypeConfiguration<BrandEntity>
{
    public void Configure(EntityTypeBuilder<BrandEntity> builder)
    {
        builder.CreateTableWithId<BrandEntity, long>("Brands");
        builder.MapAuditableRecord();
        builder.MapSoftDelete();
        builder.MapSoftDeleteQueryFilter();
        
        builder.Property(b => b.Name)
            .IsRequired();
        
        builder.Property(b => b.Description);
        
        builder.Property(b => b.IsDeleted)
            .IsRequired();
        
        builder.Property(b => b.DeletedBy)
            .HasMaxLength(50);
        
        builder.Property(b => b.DeletedOn);
    }
}