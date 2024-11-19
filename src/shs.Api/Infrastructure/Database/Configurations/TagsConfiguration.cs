using Marlo.Common.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using shs.Api.Domain.Entities;

namespace shs.Api.Infrastructure.Database.Configurations;

public class TagsConfiguration : IEntityTypeConfiguration<TagEntity>
{
    public void Configure(EntityTypeBuilder<TagEntity> builder)
    {
        builder.CreateTableWithId<TagEntity, long>("Tags");
        builder.MapAuditableRecord();
        builder.MapSoftDelete();
        builder.MapSoftDeleteQueryFilter();
        
        builder.Property(t => t.Name)
            .IsRequired();
        
        builder.Property(t => t.Description);
        
        builder.Property(t => t.IsDeleted)
            .IsRequired();
        
        builder.Property(t => t.DeletedBy)
            .HasMaxLength(50);
        
        builder.Property(t => t.DeletedOn);
    }
}
