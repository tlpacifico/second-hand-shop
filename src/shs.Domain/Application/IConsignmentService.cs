using shs.Api.Domain.Entities;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;

namespace shs.Domain.Application;

public interface IConsignmentService
{
    public Task<PageWithTotal<ConsignmentSupplierEntity>> SearchSupplierAsync(int skip, int take,
        CancellationToken ct);

    public Task<ConsignmentSupplierEntity?> GetSupplierByIdAsync(long id, CancellationToken ct);

    public Task<ConsignmentSupplierEntity> CreateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct);

    public Task<ConsignmentSupplierEntity> UpdateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct);

    Task<ConsignmentEntity> CreateConsignmentAsync(CreateConsignment request, CancellationToken ct);


}