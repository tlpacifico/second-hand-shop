namespace shs.Api.Presentation.Endpoints.Consignment.Models;

public record UpdateConsignmentRequest(
    long SupplierId,
    DateTime ConsignmentDate,
    IReadOnlyCollection<UpdateConsignmentItem> Items,
    IReadOnlyCollection<CreateConsignmentItem> NewItems,
    IReadOnlyCollection<long> DeletedItemsIds);