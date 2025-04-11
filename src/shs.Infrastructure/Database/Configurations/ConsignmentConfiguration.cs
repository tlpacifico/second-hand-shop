using Marlo.Common.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class ConsignmentConfiguration : IEntityTypeConfiguration<ConsignmentEntity>
{
    public void Configure(EntityTypeBuilder<ConsignmentEntity> builder)
    {
        builder.CreateTableWithId<ConsignmentEntity, long>("Consignments");
        builder.MapAuditableRecord();
        builder.MapSoftDelete();
        builder.MapSoftDeleteQueryFilter();
        
        builder.Property(c => c.SupplierId)
            .IsRequired();
        
        builder.Property(c => c.ConsignmentDate)
            .IsRequired();
        
        builder.Property(c => c.PickupDate);
        
        builder.Property(c => c.IsDeleted)
            .IsRequired();
        
        builder.Property(c => c.DeletedBy)
            .HasMaxLength(50);
        
        builder.Property(c => c.DeletedOn);

        builder.HasOne(c => c.Supplier)
            .WithMany()
            .HasForeignKey(c => c.SupplierId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasMany(c => c.Items)
            .WithOne(i => i.Consignment)
            .HasForeignKey(i => i.ConsignmentId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}