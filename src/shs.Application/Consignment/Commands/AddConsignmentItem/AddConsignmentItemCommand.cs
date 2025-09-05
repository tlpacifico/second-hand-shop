using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;

namespace shs.Application.Consignment.Commands.AddConsignmentItem;

public record AddConsignmentItemCommand(
    long ConsignmentId,
    string Name,
    string? Description,
    decimal EvaluatedValue,
    string Size,
    long BrandId,
    string? Color,
    IReadOnlyCollection<long> TagIds) : ICommand<ConsignmentItemResponse>;
