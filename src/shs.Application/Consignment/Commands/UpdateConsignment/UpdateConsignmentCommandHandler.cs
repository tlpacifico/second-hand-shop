using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Application.Consignment.Commands.CreateConsignment;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.UpdateConsignment;

internal class UpdateConsignmentCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<UpdateConsignmentCommand>
{
    public async Task Handle(
        UpdateConsignmentCommand command, 
        CancellationToken ct)
    {
        ConsignmentEntity consignment = await repository.GetByIdAsync(command.Id, ct);
        if (consignment == null)
        {
            throw new ArgumentException($"Consignment with id {command.Id} not found");
        }
        
        consignment.ConsignmentDate = command.ConsignmentDate;
        consignment.SupplierId = command.SupplierId;
        
        // Handle deleted items
        foreach (var deletedId in command.DeletedItemsIds)
        {
            var item = consignment.Items!.First(p => p.Id == deletedId);
            consignment.Items!.Remove(item);
        }
      
        // Handle new items
        if (command.NewItems.Count > 0)
        {
            var supplier = await repository.GetSupplierByIdAsync(consignment.SupplierId, ct);
            var nextItemSequence = await GetNextConsignmentNumberAsync(supplier.Id, ct);
        
            var consignmentItems = CreateConsignmentItems(command.NewItems, supplier, nextItemSequence);
            consignment.Items!.AddRange(consignmentItems);
        }
        
        // Handle updated items
        foreach (var item in command.UpdateItems)
        {
            var consignmentItem = consignment.Items!.First(p => p.Id == item.Id);
            consignmentItem.Size = item.Size;
            consignmentItem.BrandId = item.BrandId;
            consignmentItem.Name = item.Name;
            consignmentItem.Description = item.Description;
            consignmentItem.Color = item.Color;
            consignmentItem.EvaluatedValue = item.EvaluatedValue;
            consignmentItem.Tags = item.TagIds.Select(tagId => new ConsignmentItemTagEntity { TagId = tagId }).ToList();
        }
        
        await repository.UpdateAsync(consignment, ct);
    }

    private List<ConsignmentItemEntity> CreateConsignmentItems(
        IEnumerable<CreateConsignmentItemCommand> requestItems, 
        ConsignmentSupplierEntity supplier, int sequenceNumber)
    {
        var currentDate = DateTime.UtcNow;
        var items = new List<ConsignmentItemEntity>();
        
        foreach (var item in requestItems)
        {
            var identificationNumber = BuildIdentificationNumber(supplier.Initial, currentDate, sequenceNumber);
            items.Add(CreateConsignmentItemEntity(item, identificationNumber));
            sequenceNumber++;
        }
        
        return items;
    }

    private static ConsignmentItemEntity CreateConsignmentItemEntity(CreateConsignmentItemCommand item, string identificationNumber)
    {
        return new ConsignmentItemEntity
        {
            Status = ConsignmentStatusType.Evaluated,
            IdentificationNumber = identificationNumber,
            Size = item.Size,
            BrandId = item.BrandId,
            Name = item.Name,
            Description = item.Description,
            EvaluatedValue = item.EvaluatedValue,
            Tags = item.TagIds.Select(tagId => new ConsignmentItemTagEntity { TagId = tagId }).ToList(),
            Color = item.Color,
            PaymentMethod = new ConsignmentPaymentMethod()
            {
                PaymentAmount = null,
                PaymentType = null,
                PaymentDate = null,
                PaymentPercentage = null,
            }
        };
    }

    private string BuildIdentificationNumber(string supplierInitial, DateTime date, int sequence)
    {
        return $"{supplierInitial}{date:yyyyMM}{sequence:D4}";
    }

    private async Task<int> GetNextConsignmentNumberAsync(long supplierId, CancellationToken ct)
    {
        var lastConsignmentItem = await repository.GetLastConsignmentItemOfSupplierAsync(supplierId, ct);
        if (lastConsignmentItem == null)
        {
            return 1;
        }

        if (lastConsignmentItem.CreatedOn.Year == DateTime.UtcNow.Year &&
            lastConsignmentItem.CreatedOn.Month == DateTime.UtcNow.Month)
        {
            return ExtractAndIncrementSequentialNumber(lastConsignmentItem.IdentificationNumber);
        }

        return 1;
    }

    private static int ExtractAndIncrementSequentialNumber(string identificationNumber)
    {
        if (string.IsNullOrEmpty(identificationNumber) || identificationNumber.Length <= 8)
        {
            throw new FormatException($"Invalid identification number format: {identificationNumber}");
        }

        var sequentialPart = identificationNumber.Substring(8);

        if (!int.TryParse(sequentialPart, out var currentNumber))
        {
            throw new FormatException($"Unable to parse sequential number from: {sequentialPart}");
        }

        return currentNumber + 1;
    }
} 