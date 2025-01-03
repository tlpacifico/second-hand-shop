﻿using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;
using shs.Api.Infrastructure.Database;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using System.Linq;

namespace shs.Api.Presentation.Endpoints.Consignment;

public static class ConsignmentSupplierEndpoints
{
    public static void MapConsignmentsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/consignments").RequireAuthorization();

        group.MapGet("/suppliers", async (ShsDbContext db, CancellationToken ct) =>
            await db.ConsignmentSuppliers.Select(p => new ConsignmentSupplierResponse()
            {
                Id = p.Id,
                Name = p.Name,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                Address = p.Address
            }).ToListAsync(ct));

        group.MapGet("/suppliers/{id:long}", async (ShsDbContext db, long id, CancellationToken ct) =>
        {
            var supplier = await db.ConsignmentSuppliers.FirstOrDefaultAsync(p => p.Id == id, ct);

            return supplier is null
                ? Results.NotFound()
                : Results.Ok(new ConsignmentSupplierResponse()
                {
                    Id = supplier.Id,
                    Name = supplier.Name,
                    Email = supplier.Email,
                    PhoneNumber = supplier.PhoneNumber,
                    Address = supplier.Address
                });
        });

        group.MapPost("/suppliers",
            async (ShsDbContext db, CreateConsignmentSupplierRequest request, CancellationToken ct) =>
            {
                var supplier = request.ToEntity();
                await db.ConsignmentSuppliers.AddAsync(supplier, ct);
                await db.SaveChangesAsync(ct);
                return Results.Created($"/consignmentSuppliers/{supplier.Id}", supplier);
            });

        group.MapPut("/suppliers/{id:long}",
            async (ShsDbContext db, long id, ConsignmentSupplierEntity updatedSupplier) =>
            {
                var supplier = await db.ConsignmentSuppliers.FindAsync(id);
                if (supplier is null) return Results.NotFound();

                supplier.Name = updatedSupplier.Name;
                supplier.Email = updatedSupplier.Email;
                supplier.PhoneNumber = updatedSupplier.PhoneNumber;
                supplier.Address = updatedSupplier.Address;

                await db.SaveChangesAsync();
                return Results.NoContent();
            });

        group.MapDelete("/suppliers/{id}", async (ShsDbContext db, long id) =>
        {
            var supplier = await db.ConsignmentSuppliers.FindAsync(id);
            if (supplier is null) return Results.NotFound();

            db.ConsignmentSuppliers.Remove(supplier);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapPost("/", async (ShsDbContext db, CreateConsignmentRequest request, CancellationToken ct) =>
        {
            var consignment = request.ToEntity();
            await db.Consignments.AddAsync(consignment, ct);
            await db.SaveChangesAsync(ct);
            return Results.Created($"/api/consignments/{consignment.Id}", request);
        });

        group.MapGet("/suppliers/{id:long}/consigned", async (ShsDbContext db, long id, CancellationToken ct) =>
            await db.Consignments
                .Include(p => p.Supplier)
                .Include(p => p.Items)
                .Where(p => p.SupplierId == id)
                .Select(p => new ConsignmentResponse(
                    p.Id,
                    new ConsignmentSupplierResponse()
                    {
                        Id = p.Supplier.Id,
                        Name = p.Supplier.Name,
                        Email = p.Supplier.Email,
                        PhoneNumber = p.Supplier.PhoneNumber,
                        Address = p.Supplier.Address
                    },
                    p.ConsignmentDate,
                    p.PickupDate,
                    p.Items
                        .Select(i => new ConsignmentItem(
                            i.Id,
                            i.Name,
                            i.Description,
                            i.EvaluatedValue))
                        .ToList()
                )).ToListAsync(ct));
    }
}