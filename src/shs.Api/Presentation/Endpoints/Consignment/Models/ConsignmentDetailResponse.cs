namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public class ConsignmentDetailResponse
{
    public long Id { get; set; }
    public long SupplierId { get; set; }
    public DateTime ConsignmentDate { get; set; }
    public IReadOnlyList<ConsignmentItemResponse> Items { get; set; } = new List<ConsignmentItemResponse>();
}