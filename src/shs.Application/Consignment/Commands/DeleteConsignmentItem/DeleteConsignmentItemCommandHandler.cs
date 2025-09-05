using shs.Application.Abstractions.Messaging;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.DeleteConsignmentItem;

internal class DeleteConsignmentItemCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<DeleteConsignmentItemCommand>
{
    public async Task Handle(
        DeleteConsignmentItemCommand command, 
        CancellationToken ct)
    {
        // Get the consignment to ensure it exists
        var consignment = await repository.GetByIdAsync(command.ConsignmentId, ct);
        if (consignment == null)
        {
            throw new ArgumentException($"Consignment with id {command.ConsignmentId} not found");
        }

        // Find the specific item
        var item = consignment.Items?.FirstOrDefault(i => i.Id == command.ItemId);
        if (item == null)
        {
            throw new ArgumentException($"Item with id {command.ItemId} not found in consignment {command.ConsignmentId}");
        }

        // Remove the item from the consignment
        consignment.Items!.Remove(item);

        // Save changes
        await repository.UpdateAsync(consignment, ct);
    }
}
