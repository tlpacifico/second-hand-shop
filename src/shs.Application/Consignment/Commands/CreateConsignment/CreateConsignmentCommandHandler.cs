using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.CreateConsignment;

internal class CreateConsignmentCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<CreateConsignmentCommand, ConsignmentDetailResponse>
{
    public async Task<ConsignmentDetailResponse> Handle(
        CreateConsignmentCommand command, 
        CancellationToken ct)
    {
        var supplier = await repository.GetSupplierByIdAsync(command.SupplierId, ct);
            
        var nextItemSequence = await GetNextConsignmentNumberAsync(supplier.Id, ct);
        var consignmentItems = CreateConsignmentItems(command.Items, supplier, nextItemSequence);
        
        var consignment = new ConsignmentEntity
        {
            SupplierId = command.SupplierId,
            ConsignmentDate = command.ConsignmentDate,
            Items = consignmentItems,
        };
        
        var createdConsignment = await repository.CreateConsignmentAsync(consignment, ct);
        
        return new ConsignmentDetailResponse()
        {
            Id = createdConsignment.Id,
            SupplierId = createdConsignment.SupplierId,
            ConsignmentDate = createdConsignment.ConsignmentDate,
            Items = createdConsignment.Items!.Select(p => new ConsignmentItemResponse()
            {
                Id = p.Id,
                Name = p.Name,
                IdentificationNumber = p.IdentificationNumber,
                Status = p.Status,
                EvaluatedValue = p.EvaluatedValue,
                Size = p.Size,
                BrandId = p.BrandId,
                Color = p.Color,
                Description = p.Description,
                TagIds = p.Tags!.Select(t => t.TagId).ToList()
            }).ToList()
        };
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