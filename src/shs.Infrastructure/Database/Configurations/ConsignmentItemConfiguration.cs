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

        builder.Property(ci => ci.IdentificationNumber)
            .IsRequired()
            .HasMaxLength(15);   //TLP2025010000
     
        builder.Property(ci => ci.ConsignmentId)
            .IsRequired();
        
        builder.Property(ci => ci.Status)
            .IsRequired();
        
        builder.Property(ci => ci.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(p => p.BrandId)
            .IsRequired();
        
        builder.Property(ci => ci.Description)
            .HasMaxLength(200);
        
        builder.Property(ci => ci.Color)
            .IsRequired()
            .HasMaxLength(50);
        
        builder.Property(ci => ci.Size)
            .IsRequired()
            .HasMaxLength(10);
        
        builder.Property(ci => ci.EvaluatedValue)
            .IsRequired();
        
        builder.Property(ci => ci.IsDeleted)
            .IsRequired();
        
        builder.Property(ci => ci.DeletedBy)
            .HasMaxLength(50);

        builder.ComplexProperty(p => p.PaymentMethod, a =>
        {
            a.Property(p => p.PaymentAmount)
                .IsRequired(false);
            
            a.Property(p => p.PaymentType)
                .IsRequired(false);
            
            a.Property(p => p.PaymentDate)
                .IsRequired(false);

            a.Property(p => p.PaymentPercentage)
                .IsRequired(false);
        });
          
        
        builder.Property(ci => ci.DeletedOn);
        
        builder.HasOne(ci => ci.Consignment)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.ConsignmentId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(ci => ci.Brand)
            .WithMany()
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}