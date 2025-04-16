namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record ConsignmentSupplierResponse
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public string? Address { get; set; }
    public required string Initials { get; set; }
    public decimal CommissionPercentageInCash { get; set; }
    public decimal CommissionPercentageInProducts { get; set; }
}