using Marlo.Common.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class ConsignmentItemConfiguration : IEntityTypeConfiguration<ConsignmentItemEntity>
{
    public void Configure(EntityTypeBuilder<ConsignmentItemEntity> builder)
    {
        builder.CreateTableWithId<ConsignmentItemEntity, long>("ConsignmentItems");
        builder.MapAuditableRecord();
        builder.MapSoftDelete();
        builder.MapSoftDeleteQueryFilter();
        
        builder.Property(ci => ci.ConsignmentId)
            .IsRequired();
        
        builder.Property(ci => ci.Status)
            .IsRequired();
        
        builder.Property(ci => ci.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(ci => ci.Description)
            .HasMaxLength(200);
        
        builder.Property(ci => ci.Price)
            .IsRequired();
        
        builder.Property(ci => ci.IsDeleted)
            .IsRequired();
        
        builder.Property(ci => ci.DeletedBy)
            .HasMaxLength(50);
        
        builder.Property(ci => ci.DeletedOn);
        
        builder.HasOne(ci => ci.Consignment)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.ConsignmentId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}