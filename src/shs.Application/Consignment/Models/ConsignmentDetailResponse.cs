namespace shs.Application.Consignment.Models;

public class ConsignmentDetailResponse
{
    public long Id { get; set; }
    public long SupplierId { get; set; }
    public DateTime ConsignmentDate { get; set; }
    public IReadOnlyCollection<ConsignmentItemResponse> Items { get; set; } = new List<ConsignmentItemResponse>();
}

public class ConsignmentItemResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IdentificationNumber { get; set; } = string.Empty;
    public object Status { get; set; } = string.Empty;
    public decimal EvaluatedValue { get; set; }
    public string Size { get; set; } = string.Empty;
    public long BrandId { get; set; }
    public string? Color { get; set; }
    public string? Description { get; set; }
    public IReadOnlyCollection<long> TagIds { get; set; } = new List<long>();
}

public class ConsignmentSupplierResponse
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public decimal CommissionPercentageInCash { get; set; }
    public decimal CommissionPercentageInProducts { get; set; }
} 