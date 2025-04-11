using Marlo.Common.EntityFrameworkCore.Contracts;
using shs.Api.Domain.Enums;

namespace shs.Api.Domain.Entities;

public class ConsignmentItemEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public long ConsignmentId { get; set; }
    public ConsignmentStatusType Status { get; set; }
    
    public required ProductSizeType Size { get; set; }
    public long BrandId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required decimal EvaluatedValue { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
    
    public ConsignmentPaymentMethod PaymentMethod { get; set; }
    public virtual ConsignmentEntity? Consignment { get; set; }
    public virtual BrandEntity? Brand { get; set; }
    public virtual IEnumerable<ConsignmentItemTagEntity>? Tags { get; set; }
}