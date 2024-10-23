using Marlo.Common.EntityFrameworkCore.Contracts;

namespace shs.Api.Domain.Entities;

public class ConsignmentEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public long SupplierId { get; set; }
    public DateTime ConsignmentDate { get; set; }
    public DateTime? PickupDate { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
    
    public virtual required ConsignmentSupplierEntity Supplier { get; set; }
    public virtual required ICollection<ConsignmentItemEntity> Items { get; set; }
    
}