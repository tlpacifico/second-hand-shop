using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class ConsignmentItemTagConfiguration : IEntityTypeConfiguration<ConsignmentItemTagEntity>
{
    public void Configure(EntityTypeBuilder<ConsignmentItemTagEntity> builder)
    {
        builder.ToTable("ConsignmentItemTags");
     
        builder.HasKey(cit => new { cit.ConsignmentItemId, cit.TagId });

        builder.Property(cit => cit.ConsignmentItemId)
            .IsRequired();

        builder.Property(cit => cit.TagId)
            .IsRequired();

        builder.HasOne<ConsignmentItemEntity>()
            .WithMany(ci => ci.Tags)
            .HasForeignKey(cit => cit.ConsignmentItemId);

        builder.HasOne<TagEntity>()
            .WithMany()
            .HasForeignKey(cit => cit.TagId);
           
    }
}