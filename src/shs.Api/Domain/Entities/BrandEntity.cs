using Marlo.Common.EntityFrameworkCore.Contracts;

namespace shs.Api.Domain.Entities;

public class BrandEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
}

public enum ConsignmentPaymentType
{
    CreditInStore,
    Money
}

public class ConsignmentPaymentMethod
{
    public ConsignmentPaymentType PaymentType { get; set; }
    public int PaymentPercentage { get; set; }
    public decimal PaymentAmount { get; set; }
    public DateTime PaymentDate { get; set; }
}