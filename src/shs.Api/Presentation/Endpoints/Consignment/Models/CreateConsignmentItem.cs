using shs.Api.Domain.Enums;

namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record CreateConsignmentItem(
    string Name,
    string? Description,
    decimal Price)
{
    public required string Size { get; set; }
    public long BrandId { get; set; }
    public IReadOnlyCollection<long> TagIds { get; set; } = new List<long>();
    public string? Color { get; set; }
}

public record ConsignmentResponse(
    long Id,
    ConsignmentSupplierResponse Supplier,
    DateTime ConsignmentDate,
    DateTime? PickupDate,
    IReadOnlyCollection<ConsignmentItem> Items);

public record ConsignmentItem(
    long Id,
    string Name,
    string? Description,
    decimal Price);