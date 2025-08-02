using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;

namespace shs.Application.Consignment.Commands.CreateConsignment;

public record CreateConsignmentCommand(
    long SupplierId,
    DateTime ConsignmentDate,
    IReadOnlyCollection<CreateConsignmentItemCommand> Items) : ICommand<ConsignmentDetailResponse>;

public record CreateConsignmentItemCommand(
    string Name,
    string? Description,
    decimal EvaluatedValue,
    string Size,
    long BrandId,
    string? Color,
    IReadOnlyCollection<long> TagIds); 