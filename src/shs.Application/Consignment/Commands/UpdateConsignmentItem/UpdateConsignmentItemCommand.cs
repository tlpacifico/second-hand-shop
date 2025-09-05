using shs.Application.Abstractions.Messaging;

namespace shs.Application.Consignment.Commands.UpdateConsignmentItem;

public record UpdateConsignmentItemCommand(
    long ConsignmentId,
    long ItemId,
    string Name,
    string? Description,
    decimal EvaluatedValue,
    string Size,
    long BrandId,
    string? Color,
    IReadOnlyCollection<long> TagIds) : ICommand;
