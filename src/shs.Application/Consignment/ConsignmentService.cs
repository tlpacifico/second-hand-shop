using shs.Api.Domain.Entities;
using shs.Domain.Application;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment;

public class ConsignmentService(IConsignmentRepository repository) : IConsignmentService
{
    public async Task<PageWithTotal<ConsignmentSupplierEntity>> SearchSupplierAsync(int skip, int take, CancellationToken ct)
    {
        return await repository.SearchSupplierAsync(skip, take, ct);
    }

    public async Task<ConsignmentSupplierEntity?> GetSupplierByIdAsync(long id, CancellationToken ct)
    {
        return await repository.GetSupplierByIdAsync(id, ct); 
    }

    public async Task<ConsignmentSupplierEntity> CreateSupplierAsync(ConsignmentSupplierEntity supplier, CancellationToken ct)
    {
        return await repository.CreateSupplierAsync(supplier, ct);
    }

    public async Task<ConsignmentSupplierEntity> UpdateSupplierAsync(ConsignmentSupplierEntity supplier, CancellationToken ct)
    {
        return await repository.UpdateSupplierAsync(supplier, ct);
    }
}