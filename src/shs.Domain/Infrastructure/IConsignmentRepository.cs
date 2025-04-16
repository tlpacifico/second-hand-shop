﻿using shs.Api.Domain.Entities;
using shs.Domain.Presentation.Models;

namespace shs.Domain.Infrastructure;

public interface IConsignmentRepository
{
    public Task<PageWithTotal<ConsignmentSupplierEntity>> SearchSupplierAsync(int skip, int take,
        CancellationToken ct);

    public Task<ConsignmentSupplierEntity?> GetSupplierByIdAsync(long id, CancellationToken ct);

    public Task<ConsignmentSupplierEntity> CreateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct);

    public Task<ConsignmentSupplierEntity> UpdateSupplierAsync(ConsignmentSupplierEntity supplier,
        CancellationToken ct);
}