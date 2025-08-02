using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Commands.CreateConsignment;

namespace shs.Application.Consignment.Commands.UpdateConsignment;

public record UpdateConsignmentCommand(
    long Id,
    long SupplierId,
    DateTime ConsignmentDate,
    IReadOnlyCollection<UpdateConsignmentItemCommand> UpdateItems,
    IReadOnlyCollection<CreateConsignmentItemCommand> NewItems,
    IReadOnlyCollection<long> DeletedItemsIds) : ICommand;

public record UpdateConsignmentItemCommand(
    long Id,
    string Name,
    string? Description,
    decimal EvaluatedValue,
    string Size,
    long BrandId,
    string? Color,
    IReadOnlyCollection<long> TagIds); 