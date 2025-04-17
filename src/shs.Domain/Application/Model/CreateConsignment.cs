using shs.Api.Domain.Enums;

namespace shs.Domain.Application.Model;

public class CreateConsignment
{
    public long SupplierId { get; set; }
    public DateTime ConsignmentDate { get; set; }
    public virtual ICollection<CreateConsignmentItem> Items { get; set; } = new List<CreateConsignmentItem>();
}

public class ConsignmentSupplier 
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    
    public required string Initial { get; init; }

    public decimal CommissionPercentageInCash { get; set; }
    public decimal CommissionPercentageInProducts { get; set; }
    public string? Address { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
}

public class CreateConsignmentItem
{
    public long ConsignmentId { get; set; }
    public required string Size { get; set; }
    public long BrandId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public required decimal EvaluatedValue { get; set; }
    public  IReadOnlyCollection<long> Tags { get; set; } = new List<long>();

}