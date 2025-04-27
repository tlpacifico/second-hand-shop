using shs.Api.Domain.Enums;

namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public class ConsignmentItemResponse
{
    public long Id { get; set; }
    public required string IdentificationNumber { get; set; } // It's a unique identifier for the item in the store Initial of supplier + year + month + sequence number
    public ConsignmentStatusType Status { get; set; }
    public required string Size { get; set; }
    public long BrandId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public required decimal EvaluatedValue { get; set; }
    public IReadOnlyCollection<long> TagIds { get; set; } = new List<long>();
}