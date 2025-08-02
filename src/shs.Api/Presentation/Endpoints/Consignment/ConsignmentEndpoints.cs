using Microsoft.AspNetCore.Mvc;
using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Commands.CreateConsignment;
using shs.Application.Consignment.Commands.CreateSupplier;
using shs.Application.Consignment.Commands.DeleteSupplier;
using shs.Application.Consignment.Commands.UpdateConsignment;
using shs.Application.Consignment.Commands.UpdateSupplier;
using shs.Application.Consignment.Models;
using shs.Application.Consignment.Queries.GetConsignmentById;
using shs.Application.Consignment.Queries.GetSupplierById;
using shs.Application.Consignment.Queries.SearchConsignments;
using shs.Application.Consignment.Queries.SearchSuppliers;
using shs.Domain;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;
using shs.Api.Domain.Entities;
using CreateConsignmentRequest = shs.Api.Presentation.Endpoints.Consignment.Models.CreateConsignmentRequest;
using UpdateConsignmentRequest = shs.Api.Presentation.Endpoints.Consignment.Models.UpdateConsignmentRequest;
using CreateConsignmentSupplierRequest = shs.Api.Presentation.Endpoints.Consignment.Models.CreateConsignmentSupplierRequest;

namespace shs.Api.Presentation.Endpoints.Consignment;

public static class ConsignmentEndpoints
{
    public static void MapConsignmentsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(ApiConstants.ConsignmentRoutes.Path).RequireAuthorization();

        // Query endpoints
        group.MapGet(ApiConstants.ConsignmentRoutes.Search,
            async ([AsParameters] GetPage page,
                IQueryHandler<SearchConsignmentsQuery, PageWithTotal<ConsignmentSearchResult>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.Handle(new SearchConsignmentsQuery(page.Skip, page.Take), ct);
                return Results.Ok(result);
            })
            .Produces<PageWithTotal<ConsignmentSearchResult>>();

        group.MapGet(ApiConstants.ConsignmentRoutes.GetById,
            async (IQueryHandler<GetConsignmentByIdQuery, ConsignmentDetailResponse> handler,
                [FromRoute] long id, CancellationToken ct) =>
            {
                try
                {
                    var result = await handler.Handle(new GetConsignmentByIdQuery(id), ct);
                    return Results.Ok(result);
                }
                catch (ArgumentException)
                {
                    return Results.NotFound();
                }
            })
            .Produces<ConsignmentDetailResponse>()
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet(ApiConstants.ConsignmentRoutes.SearchSuppliers,
            async ([AsParameters] GetPage page,
                IQueryHandler<SearchSuppliersQuery, PageWithTotal<ConsignmentSupplierResponse>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.Handle(new SearchSuppliersQuery(page.Skip, page.Take), ct);
                return Results.Ok(result);
            })
            .Produces<PageWithTotal<ConsignmentSupplierResponse>>();

        group.MapGet(ApiConstants.ConsignmentRoutes.GetSupplierById,
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

        group.MapGet(ApiConstants.ConsignmentRoutes.GetAllSuppliers,
            async (IQueryHandler<SearchSuppliersQuery, PageWithTotal<ConsignmentSupplierResponse>> handler,
                CancellationToken ct) =>
            {
                // Using the existing service but with a large value for Take to get all suppliers
                var result = await handler.Handle(new SearchSuppliersQuery(0, int.MaxValue), ct);
                return Results.Ok(result.Items);
            })
            .Produces<List<ConsignmentSupplierResponse>>(StatusCodes.Status200OK);

        // Command endpoints
        group.MapPost(ApiConstants.ConsignmentRoutes.CreateSupplier,
            async (ICommandHandler<CreateSupplierCommand, ConsignmentSupplierResponse> handler,
                CreateConsignmentSupplierRequest request, CancellationToken ct) =>
            {
                var command = new CreateSupplierCommand(
                    request.Name,
                    request.Email,
                    request.PhoneNumber,
                    request.Address,
                    request.Initial,
                    request.CommissionPercentageInCash,
                    request.CommissionPercentageInProducts);

                var result = await handler.Handle(command, ct);
                return Results.Created(
                    $"{ApiConstants.ConsignmentRoutes.Path}/{ApiConstants.ConsignmentRoutes.SearchSuppliers}/{result.Id}",
                    result);
            })
            .Produces<ConsignmentSupplierResponse>(StatusCodes.Status201Created);

        group.MapPut(ApiConstants.ConsignmentRoutes.UpdateSupplier,
            async (ICommandHandler<UpdateSupplierCommand> handler,
                [FromRoute] long id, [FromBody] ConsignmentSupplierEntity updatedSupplier, CancellationToken ct) =>
            {
                var command = new UpdateSupplierCommand(
                    id,
                    updatedSupplier.Name,
                    updatedSupplier.Email,
                    updatedSupplier.PhoneNumber,
                    updatedSupplier.Address);

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

        group.MapDelete(ApiConstants.ConsignmentRoutes.DeleteSupplier,
            async (ICommandHandler<DeleteSupplierCommand> handler,
                [FromRoute] long id, CancellationToken ct) =>
            {
                await handler.Handle(new DeleteSupplierCommand(id), ct);
                return Results.NoContent();
            })
            .Produces(StatusCodes.Status204NoContent);

        group.MapPost(ApiConstants.ConsignmentRoutes.Create,
            async (ICommandHandler<CreateConsignmentCommand, ConsignmentDetailResponse> handler,
                CreateConsignmentRequest request, CancellationToken ct) =>
            {
                var command = new CreateConsignmentCommand(
                    request.SupplierId,
                    request.ConsignmentDate,
                    request.Items.Select(item => new CreateConsignmentItemCommand(
                        item.Name,
                        item.Description,
                        item.Price, // Note: This should be EvaluatedValue
                        item.Size,
                        item.BrandId,
                        item.Color,
                        item.TagIds)).ToList());

                var result = await handler.Handle(command, ct);
                return Results.Created($"{ApiConstants.ConsignmentRoutes.Path}/{result.Id}", result);
            })
            .Produces<ConsignmentDetailResponse>(StatusCodes.Status201Created);

        group.MapPut(ApiConstants.ConsignmentRoutes.Update,
            async (ICommandHandler<UpdateConsignmentCommand> handler,
                [FromRoute] long id, [FromBody] UpdateConsignmentRequest request, CancellationToken ct) =>
            {
                var command = new UpdateConsignmentCommand(
                    id,
                    request.SupplierId,
                    request.ConsignmentDate,
                    request.Items.Select(item => new UpdateConsignmentItemCommand(
                        item.Id,
                        item.Name,
                        item.Description,
                        item.Price, // Note: This should be EvaluatedValue
                        item.Size,
                        item.BrandId,
                        item.Color,
                        item.TagIds)).ToList(),
                    request.NewItems.Select(item => new CreateConsignmentItemCommand(
                        item.Name,
                        item.Description,
                        item.Price, // Note: This should be EvaluatedValue
                        item.Size,
                        item.BrandId,
                        item.Color,
                        item.TagIds)).ToList(),
                    request.DeletedItemsIds);

                try
                {
                    await handler.Handle(command, ct);
                    return Results.Accepted();
                }
                catch (ArgumentException)
                {
                    return Results.NotFound();
                }
            })
            .Produces(StatusCodes.Status202Accepted)
            .Produces(StatusCodes.Status404NotFound);
    }
}