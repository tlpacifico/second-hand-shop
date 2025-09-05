namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record AddConsignmentItemRequest(
    string Name,
    string? Description,
    decimal Price,
    string Size,
    long BrandId,
    string? Color,
    IReadOnlyCollection<long> TagIds);
