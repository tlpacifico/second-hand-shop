﻿using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;
using shs.Database.Database;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;

namespace shs.Database.Repository;

public class ConsignmentRepository(ShsDbContext dbContext) : IConsignmentRepository
{
    public async Task<PageWithTotal<ConsignmentSupplierEntity>> SearchSupplierAsync(int skip, int take,
        CancellationToken ct)
    {
        var result = await dbContext.ConsignmentSuppliers.AsPageWithTotalAsync(
            skip,
            take, ct);

        return result;
    }

    public async Task<ConsignmentSupplierEntity?> GetSupplierByIdAsync(long id, CancellationToken ct)
    {
        return await dbContext.ConsignmentSuppliers.GetByIdAndEnsureExistsAsync(id, ct);
    }

    public async Task<ConsignmentSupplierEntity> CreateSupplierAsync(ConsignmentSupplierEntity supplier, CancellationToken ct)
    {
        var result = await dbContext.ConsignmentSuppliers.AddAsync(supplier, ct);
        await dbContext.SaveChangesAsync(ct);
        return result.Entity;
    }

    public async Task<ConsignmentSupplierEntity> UpdateSupplierAsync(ConsignmentSupplierEntity supplier, CancellationToken ct)
    {
        dbContext.ConsignmentSuppliers.Update(supplier);
        await dbContext.SaveChangesAsync(ct);
        return supplier;
    }
}