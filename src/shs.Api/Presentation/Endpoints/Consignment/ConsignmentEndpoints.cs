using Microsoft.EntityFrameworkCore;
using shs.Api.Domain.Entities;
using shs.Api.Infrastructure.Database;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using shs.Database.Database;
using shs.Domain;
using shs.Domain.Application;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;

namespace shs.Api.Presentation.Endpoints.Consignment;

public static class ConsignmentEndpoints
{
    public static void MapConsignmentsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(ApiConstants.ConsignmentRoutes.Path).RequireAuthorization();
        
        group.MapGet(ApiConstants.ConsignmentRoutes.Consignments,
            async ([AsParameters] GetPage page, IConsignmentService service, CancellationToken ct) =>
            {
                var result = await service.SearchAsync(page.Skip, page.Take, ct);
                return Results.Ok(result);
            }).Produces<PageWithTotal<ConsignmentSearchResult>>();
        

        group.MapGet(ApiConstants.ConsignmentRoutes.ConsignmentById,
            async (ShsDbContext context, [FromRoute]  long id, CancellationToken ct) =>
            {
                var consignment = await context.Consignments
                    .Include(p => p.Items)!
                    .ThenInclude(p => p.Tags)
                    .FirstOrDefaultAsync(p => p.Id == id, ct);
                
                return consignment is null
                    ? Results.NotFound()
                    : Results.Ok(new ConsignmentDetailResponse()
                    {
                        Id = consignment.Id,
                        SupplierId = consignment.SupplierId,
                        ConsignmentDate = consignment.ConsignmentDate,
                        Items = consignment.Items!.Select(p => new ConsignmentItemResponse()
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
                    });
            }).Produces<ConsignmentDetailResponse>()
            .Produces(StatusCodes.Status404NotFound);
        
        group.MapGet(ApiConstants.ConsignmentRoutes.Owners,
            async ([AsParameters] GetPage page, IConsignmentService service, CancellationToken ct) =>
            {
                var result = await service.SearchSupplierAsync(page.Skip, page.Take, ct);
                return Results.Ok(new PageWithTotal<ConsignmentSupplierResponse>(
                    page.Skip,
                    page.Take,
                    result.Items.Select(p => new ConsignmentSupplierResponse()
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Email = p.Email,
                        PhoneNumber = p.PhoneNumber,
                        Address = p.Address,
                        Initials = p.Initial,
                        CommissionPercentageInCash = p.CommissionPercentageInCash,
                        CommissionPercentageInProducts = p.CommissionPercentageInProducts
                    }).ToList(),
                    result.Total));
            }).Produces<PageWithTotal<ConsignmentSupplierResponse>>();;

        group.MapGet(ApiConstants.ConsignmentRoutes.OwnersById,
            async (IConsignmentService service, long id, CancellationToken ct) =>
            {
                var supplier = await service.GetSupplierByIdAsync(id, ct);

                return supplier is null
                    ? Results.NotFound()
                    : Results.Ok(new ConsignmentSupplierResponse()
                    {
                        Id = supplier.Id,
                        Name = supplier.Name,
                        Email = supplier.Email,
                        PhoneNumber = supplier.PhoneNumber,
                        Address = supplier.Address,
                        Initials = supplier.Initial,
                        CommissionPercentageInCash = supplier.CommissionPercentageInCash,
                        CommissionPercentageInProducts = supplier.CommissionPercentageInProducts
                    });
            }).Produces<ConsignmentSupplierResponse>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost(ApiConstants.ConsignmentRoutes.Owners,
            async (ShsDbContext db, CreateConsignmentSupplierRequest request, CancellationToken ct) =>
            {
                var supplier = request.ToEntity();
                await db.ConsignmentSuppliers.AddAsync(supplier, ct);
                await db.SaveChangesAsync(ct);
                return Results.Created(
                    $"{ApiConstants.ConsignmentRoutes.Path}/{ApiConstants.ConsignmentRoutes.Owners}/{supplier.Id}",
                    supplier);
            }).Produces(StatusCodes.Status201Created);

        group.MapPut(ApiConstants.ConsignmentRoutes.OwnersById,
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

        group.MapDelete(ApiConstants.ConsignmentRoutes.OwnersById, async (ShsDbContext db, long id) =>
        {
            var supplier = await db.ConsignmentSuppliers.FindAsync(id);
            if (supplier is null) return Results.NotFound();

            db.ConsignmentSuppliers.Remove(supplier);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        group.MapPost(ApiConstants.ConsignmentRoutes.Create,
            async (IConsignmentService service, CreateConsignmentRequest request, CancellationToken ct) =>
            {
                var consignment = await service.CreateConsignmentAsync(request.ToService(), ct);
                return Results.Created($"{ApiConstants.ConsignmentRoutes.Path}/{consignment.Id}", request);
            });
      
        group.MapGet(ApiConstants.ConsignmentRoutes.OwnersAll,
            async (IConsignmentService service, CancellationToken ct) =>
            {
                // Using the existing service but with a large value for Take to get all suppliers
                // We could consider adding a dedicated method to the service for this case
                var result = await service.SearchSupplierAsync(0, int.MaxValue, ct);

                return Results.Ok(result.Items.Select(p => new ConsignmentSupplierResponse()
                {
                    Id = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    PhoneNumber = p.PhoneNumber,
                    Address = p.Address,
                    Initials = p.Initial,
                    CommissionPercentageInCash = p.CommissionPercentageInCash,
                    CommissionPercentageInProducts = p.CommissionPercentageInProducts
                }).ToList());
            }).Produces<List<ConsignmentSupplierResponse>>(StatusCodes.Status200OK);
    }
}