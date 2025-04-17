using Marlo.Common.EntityFrameworkCore.Contracts;
using shs.Api.Domain.Enums;

namespace shs.Api.Domain.Entities;

public class ConsignmentItemEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public long ConsignmentId { get; set; }
    
    public required string IdentificationNumber { get; set; } // It's a unique identifier for the item in the store Initial of supplier + year + month + sequence number
    public ConsignmentStatusType Status { get; set; }
    public required string Size { get; set; }
    public long BrandId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public required decimal EvaluatedValue { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
    
    public ConsignmentPaymentMethod PaymentMethod { get; set; }
    public virtual ConsignmentEntity? Consignment { get; set; }
    public virtual BrandEntity? Brand { get; set; }
    public virtual IEnumerable<ConsignmentItemTagEntity>? Tags { get; set; }
}