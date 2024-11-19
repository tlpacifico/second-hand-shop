using Marlo.Common.EntityFrameworkCore.Contracts;

namespace shs.Api.Domain.Entities;

public class TagEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
}