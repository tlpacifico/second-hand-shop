using shs.Application.Abstractions.Messaging;

namespace shs.Application.Consignment.Commands.DeleteConsignmentItem;

public record DeleteConsignmentItemCommand(
    long ConsignmentId,
    long ItemId) : ICommand;
