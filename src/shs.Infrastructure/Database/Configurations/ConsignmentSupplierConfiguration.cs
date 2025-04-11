using Marlo.Common.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class ConsignmentSupplierConfiguration : IEntityTypeConfiguration<ConsignmentSupplierEntity>
{
    public void Configure(EntityTypeBuilder<ConsignmentSupplierEntity> builder)
    {
        builder.CreateTableWithId<ConsignmentSupplierEntity, long>("ConsignmentSuppliers");
        builder.MapAuditableRecord();
        builder.MapSoftDelete();
        builder.MapSoftDeleteQueryFilter();
        
        builder.Property(cs => cs.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(cs => cs.Email)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(cs => cs.PhoneNumber)
            .IsRequired()
            .HasMaxLength(15);
        
        builder.Property(cs => cs.Address)
            .HasMaxLength(200);
        
        builder.Property(cs => cs.IsDeleted)
            .IsRequired();
        
        builder.Property(cs => cs.DeletedBy)
            .HasMaxLength(50);
        
        builder.Property(cs => cs.DeletedOn);
    }
}