using Microsoft.AspNetCore.Mvc;
using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Commands.CreateConsignment;
using shs.Application.Consignment.Commands.UpdateConsignment;
using shs.Application.Consignment.Models;
using shs.Application.Consignment.Queries.GetConsignmentById;
using shs.Application.Consignment.Queries.SearchConsignments;
using shs.Domain;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;
using CreateConsignmentRequest = shs.Api.Presentation.Endpoints.Consignment.Models.CreateConsignmentRequest;
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

        // Command endpoints
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