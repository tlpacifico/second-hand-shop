using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.AddConsignmentItem;

internal class AddConsignmentItemCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<AddConsignmentItemCommand, ConsignmentItemResponse>
{
    public async Task<ConsignmentItemResponse> Handle(
        AddConsignmentItemCommand command, 
        CancellationToken ct)
    {
        // Get the consignment to ensure it exists
        var consignment = await repository.GetByIdAsync(command.ConsignmentId, ct);
        if (consignment == null)
        {
            throw new ArgumentException($"Consignment with id {command.ConsignmentId} not found");
        }

        // Get supplier for identification number generation
        var supplier = await repository.GetSupplierByIdAsync(consignment.SupplierId, ct);
        var nextItemSequence = await GetNextConsignmentNumberAsync(supplier.Id, ct);
        
        // Create identification number
        var currentDate = DateTime.UtcNow;
        var identificationNumber = BuildIdentificationNumber(supplier.Initial, currentDate, nextItemSequence);
        
        // Create the item entity
        var itemEntity = new ConsignmentItemEntity
        {
            ConsignmentId = command.ConsignmentId,
            IdentificationNumber = identificationNumber,
            Status = ConsignmentStatusType.Evaluated,
            Size = command.Size,
            BrandId = command.BrandId,
            Name = command.Name,
            Description = command.Description,
            Color = command.Color,
            EvaluatedValue = command.EvaluatedValue,
            PaymentMethod = new ConsignmentPaymentMethod(),
            Tags = command.TagIds.Select(tagId => new ConsignmentItemTagEntity { TagId = tagId }).ToList()
        };
        
        // Add item to consignment
        consignment.Items!.Add(itemEntity);
        await repository.UpdateAsync(consignment, ct);
        
        // Return the created item
        return new ConsignmentItemResponse
        {
            Id = itemEntity.Id,
            Name = itemEntity.Name,
            Description = itemEntity.Description,
            EvaluatedValue = itemEntity.EvaluatedValue,
            Size = itemEntity.Size,
            BrandId = itemEntity.BrandId,
            Color = itemEntity.Color,
            Status = itemEntity.Status,
            IdentificationNumber = itemEntity.IdentificationNumber,
            TagIds = command.TagIds
        };
    }

    private async Task<int> GetNextConsignmentNumberAsync(long supplierId, CancellationToken ct)
    {
        var currentDate = DateTime.UtcNow;
        var yearMonth = $"{currentDate:yyyyMM}";
        
        var lastSequence = await repository.GetLastSequenceNumberForMonthAsync(supplierId, yearMonth, ct);
        return lastSequence + 1;
    }

    private static string BuildIdentificationNumber(string supplierInitial, DateTime date, int sequence)
    {
        return $"{supplierInitial}{date:yyyyMM}{sequence:D4}";
    }
}
