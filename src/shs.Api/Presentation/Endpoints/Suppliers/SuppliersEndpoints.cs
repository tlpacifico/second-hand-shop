using Microsoft.AspNetCore.Mvc;
using shs.Api.Domain.Entities;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Commands.CreateSupplier;
using shs.Application.Consignment.Commands.DeleteSupplier;
using shs.Application.Consignment.Commands.UpdateSupplier;
using shs.Application.Consignment.Models;
using shs.Application.Consignment.Queries.GetSupplierById;
using shs.Application.Consignment.Queries.SearchSuppliers;
using shs.Domain;
using shs.Domain.Presentation.Models;

namespace shs.Api.Presentation.Endpoints.Suppliers;

public static class SuppliersEndpoints
{
    public static void MapSuppliersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(ApiConstants.SupplierRoutes.Path).RequireAuthorization();

        // Query endpoints
        group.MapGet(ApiConstants.SupplierRoutes.Search,
            async ([AsParameters] GetPage page,
                IQueryHandler<SearchSuppliersQuery, PageWithTotal<ConsignmentSupplierResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.Handle(new SearchSuppliersQuery(page.Skip, page.Take), ct);
                return Results.Ok(result);
            })
            .Produces<PageWithTotal<ConsignmentSupplierResponse>>();

        group.MapGet(ApiConstants.SupplierRoutes.GetById,
            async (IQueryHandler<GetSupplierByIdQuery, ConsignmentSupplierResponse> handler,
                [FromRoute] long id, CancellationToken ct) =>
            {
                try
                {
                    var result = await handler.Handle(new GetSupplierByIdQuery(id), ct);
                    return Results.Ok(result);
                }
                catch (ArgumentException)
                {
                    return Results.NotFound();
                }
            })
            .Produces<ConsignmentSupplierResponse>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet(ApiConstants.SupplierRoutes.GetAll,
            async (IQueryHandler<SearchSuppliersQuery, PageWithTotal<ConsignmentSupplierResponse>> handler,
                CancellationToken ct) =>
            {
                // Using the existing service but with a large value for Take to get all suppliers
                var result = await handler.Handle(new SearchSuppliersQuery(0, int.MaxValue), ct);
                return Results.Ok(result.Items);
            })
            .Produces<List<ConsignmentSupplierResponse>>();

        // Command endpoints
        group.MapPost(ApiConstants.SupplierRoutes.Create,
            async (ICommandHandler<CreateSupplierCommand, ConsignmentSupplierResponse> handler,
                CreateConsignmentSupplierRequest request, CancellationToken ct) =>
            {
                var command = new CreateSupplierCommand(
                    request.Name,
                    request.Email,
                    request.PhoneNumber,
                    request.Address ?? string.Empty,
                    request.Initial,
                    request.CommissionPercentageInCash,
                    request.CommissionPercentageInProducts);

                var result = await handler.Handle(command, ct);
                return Results.Created($"{ApiConstants.SupplierRoutes.Path}/{result.Id}", result);
            })
            .Produces<ConsignmentSupplierResponse>(StatusCodes.Status201Created);

        group.MapPut(ApiConstants.SupplierRoutes.Update,
            async (ICommandHandler<UpdateSupplierCommand> handler,
                [FromRoute] long id, [FromBody] ConsignmentSupplierEntity updatedSupplier, CancellationToken ct) =>
            {
                var command = new UpdateSupplierCommand(
                    id,
                    updatedSupplier.Name,
                    updatedSupplier.Email,
                    updatedSupplier.PhoneNumber,
                    updatedSupplier.Address ?? string.Empty);

                try
                {
                    await handler.Handle(command, ct);
                    return Results.NoContent();
                }
                catch (ArgumentException)
                {
                    return Results.NotFound();
                }
            })
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete(ApiConstants.SupplierRoutes.Delete,
            async (ICommandHandler<DeleteSupplierCommand> handler,
                [FromRoute] long id, CancellationToken ct) =>
            {
                await handler.Handle(new DeleteSupplierCommand(id), ct);
                return Results.NoContent();
            })
            .Produces(StatusCodes.Status204NoContent);
    }
}
