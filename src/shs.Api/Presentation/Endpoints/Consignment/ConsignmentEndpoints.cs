using Microsoft.AspNetCore.Mvc;
using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Commands.AddConsignmentItem;
using shs.Application.Consignment.Commands.CreateConsignment;
using shs.Application.Consignment.Commands.DeleteConsignmentItem;
using shs.Application.Consignment.Commands.UpdateConsignment;
using UpdateConsignment = shs.Application.Consignment.Commands.UpdateConsignment;
using shs.Application.Consignment.Commands.UpdateConsignmentItem;
using UpdateSingleConsignmentItemCommand = shs.Application.Consignment.Commands.UpdateConsignmentItem.UpdateConsignmentItemCommand;
using shs.Application.Consignment.Models;
using shs.Application.Consignment.Queries.GetConsignmentById;
using shs.Application.Consignment.Queries.SearchConsignments;
using shs.Domain;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;
using AddConsignmentItemRequest = shs.Api.Presentation.Endpoints.Consignment.Models.AddConsignmentItemRequest;
using CreateConsignmentRequest = shs.Api.Presentation.Endpoints.Consignment.Models.CreateConsignmentRequest;
using UpdateConsignmentItemRequest = shs.Api.Presentation.Endpoints.Consignment.Models.UpdateConsignmentItemRequest;
using UpdateConsignmentRequest = shs.Api.Presentation.Endpoints.Consignment.Models.UpdateConsignmentRequest;

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
                    var result = await handler.Handle(new GetConsignmentByIdQuery(id), ct);
                    return Results.Ok(result);
                })
            .Produces<ConsignmentDetailResponse>()
            .Produces(StatusCodes.Status404NotFound);

        // Command endpoints
        group.MapPost(ApiConstants.ConsignmentRoutes.Create,
                async (ICommandHandler<CreateConsignmentCommand, ConsignmentDetailResponse> handler,
                    CreateConsignmentRequest request, CancellationToken ct) =>
                {
                    var command = new CreateConsignmentCommand(
                        request.SupplierId,
                        request.ConsignmentDate);

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
                        request.Items.Select(item => new UpdateConsignment.UpdateConsignmentItemCommand(
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

                    await handler.Handle(command, ct);
                    return Results.Accepted();
                })
            .Produces(StatusCodes.Status202Accepted)
            .Produces(StatusCodes.Status404NotFound);

        // Item-specific endpoints
        group.MapPost(ApiConstants.ConsignmentRoutes.AddNewItem,
                async (ICommandHandler<AddConsignmentItemCommand, ConsignmentItemResponse> handler,
                    [FromRoute] long consignmentId, [FromBody] AddConsignmentItemRequest request, CancellationToken ct) =>
                {
                    var command = new AddConsignmentItemCommand(
                        consignmentId,
                        request.Name,
                        request.Description,
                        request.Price,
                        request.Size,
                        request.BrandId,
                        request.Color,
                        request.TagIds);

                    var result = await handler.Handle(command, ct);
                    return Results.Created($"{ApiConstants.ConsignmentRoutes.Path}/{consignmentId}/items/{result.Id}", result);
                })
            .Produces<ConsignmentItemResponse>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPut(ApiConstants.ConsignmentRoutes.UpdateItem,
                async (ICommandHandler<UpdateSingleConsignmentItemCommand> handler,
                    [FromRoute] long consignmentId, [FromRoute] long itemId, [FromBody] UpdateConsignmentItemRequest request, CancellationToken ct) =>
                {
                    var command = new UpdateSingleConsignmentItemCommand(
                        consignmentId,
                        itemId,
                        request.Name,
                        request.Description,
                        request.Price,
                        request.Size,
                        request.BrandId,
                        request.Color,
                        request.TagIds);

                    await handler.Handle(command, ct);
                    return Results.NoContent();
                })
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete(ApiConstants.ConsignmentRoutes.DeleteItem,
                async (ICommandHandler<DeleteConsignmentItemCommand> handler,
                    [FromRoute] long consignmentId, [FromRoute] long itemId, CancellationToken ct) =>
                {
                    var command = new DeleteConsignmentItemCommand(consignmentId, itemId);
                    
                    await handler.Handle(command, ct);
                    return Results.NoContent();
                })
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);
    }
}