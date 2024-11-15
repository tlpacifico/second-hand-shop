namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record CreateConsignmentItem(
    string Name,
    string? Description,
    decimal Price);