namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record CreateConsignmentSupplierRequest
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public string? Address { get; set; }
}