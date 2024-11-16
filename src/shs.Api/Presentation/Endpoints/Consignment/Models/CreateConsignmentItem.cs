namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record CreateConsignmentItem(
    string Name,
    string? Description,
    decimal Price);

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