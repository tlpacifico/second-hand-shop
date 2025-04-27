using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Domain.Application;
using shs.Domain.Application.Model;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment;

public class ConsignmentService(IConsignmentRepository repository) : IConsignmentService
{
    public async Task<PageWithTotal<ConsignmentSupplierEntity>> SearchSupplierAsync(int skip, int take,
        CancellationToken ct)
    {
        return await repository.SearchSupplierAsync(skip, take, ct);
    }

    public async Task<ConsignmentSupplierEntity?> GetSupplierByIdAsync(long id, CancellationToken ct)
    {
        return await repository.GetSupplierByIdAsync(id, ct);
    }

    public async Task<ConsignmentSupplierEntity> CreateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct)
    {
        return await repository.CreateSupplierAsync(supplier, ct);
    }

    public async Task<ConsignmentSupplierEntity> UpdateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct)
    {
        return await repository.UpdateSupplierAsync(supplier, ct);
    }

    public async Task<ConsignmentEntity> CreateConsignmentAsync(CreateConsignment request, CancellationToken ct)
    {
        var supplier = await repository.GetSupplierByIdAsync(request.SupplierId, ct);
        var nextItemSequence = await GetNextConsignmentNumberAsync(supplier.Id, ct);
        
        var consignmentItems = CreateConsignmentItems(request.Items, supplier, ref nextItemSequence);
        
        var consignment = new ConsignmentEntity
        {
            SupplierId = request.SupplierId,
            ConsignmentDate = request.ConsignmentDate,
            Items = consignmentItems,
        };
        
        return await repository.CreateConsignmentAsync(consignment, ct);
    }

    public async Task<PageWithTotal<ConsignmentSearchResult>> SearchAsync(int pageSkip, int pageTake, CancellationToken ct)
    {
        var result = await repository.SearchAsync(pageSkip, pageTake, ct);
        
        return new PageWithTotal<ConsignmentSearchResult>(
            pageSkip,
            pageTake,
            result.Items.Select(p => new ConsignmentSearchResult()
            {
                Id = p.Id,
                SupplierName = p.Supplier!.Name,
                ConsignmentDate = p.ConsignmentDate,
                TotalItems = p.Items!.Count,
            }).ToList(),
            result.Total);
    }

    private List<ConsignmentItemEntity> CreateConsignmentItems(
        IEnumerable<CreateConsignmentItem> requestItems, 
        ConsignmentSupplierEntity supplier, 
        ref int sequenceNumber)
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

    private static ConsignmentItemEntity CreateConsignmentItemEntity(CreateConsignmentItem item, string identificationNumber)
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
            Tags = item.Tags.Select(tagId => new ConsignmentItemTagEntity { TagId = tagId }).ToList(),
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

    private static string BuildIdentificationNumber(string supplierInitial, DateTime date, int sequence)
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

    /// <summary>
    /// Extracts the sequential number from the identification number and increments it by one.
    /// The identification number format is expected to have the sequential number after the 8th character.
    /// </summary>
    /// <param name="identificationNumber">The identification number to extract the sequential part from</param>
    /// <returns>The incremented sequential number</returns>
    /// <exception cref="FormatException">Thrown when the identification number has an invalid format</exception>
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