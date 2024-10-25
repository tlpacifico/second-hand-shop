﻿using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;
using shs.Api.Infrastructure.Database;

namespace shs.Api.Presentation.Endpoints;

public static class ConsignmentSupplierEndpoints
{
    public static void MapConsignmentsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/consignments");

        group.MapGet("/suppliers", async (ShsDbContext db) =>
            await db.ConsignmentSuppliers.ToListAsync());

        group.MapGet("/suppliers/{id}", async (ShsDbContext db, long id) =>
            await db.ConsignmentSuppliers.FindAsync(id) is ConsignmentSupplierEntity supplier
                ? Results.Ok(supplier)
                : Results.NotFound());

        group.MapPost("/suppliers", async (ShsDbContext db, ConsignmentSupplierEntity supplier) =>
        {
            db.ConsignmentSuppliers.Add(supplier);
            await db.SaveChangesAsync();
            return Results.Created($"/consignmentSuppliers/{supplier.Id}", supplier);
        });

        group.MapPut("/suppliers/{id}", async (ShsDbContext db, long id, ConsignmentSupplierEntity updatedSupplier) =>
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
    }
}