using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.UpdateConsignmentItem;

internal class UpdateConsignmentItemCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<UpdateConsignmentItemCommand>
{
    public async Task Handle(
        UpdateConsignmentItemCommand command, 
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

        // Update the item properties
        item.Name = command.Name;
        item.Description = command.Description;
        item.EvaluatedValue = command.EvaluatedValue;
        item.Size = command.Size;
        item.BrandId = command.BrandId;
        item.Color = command.Color;
        item.Tags = command.TagIds.Select(tagId => new ConsignmentItemTagEntity { TagId = tagId }).ToList();

        // Save changes
        await repository.UpdateAsync(consignment, ct);
    }
}
