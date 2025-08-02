using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Queries.GetConsignmentById;

internal class GetConsignmentByIdQueryHandler(
    IConsignmentRepository repository)
    : IQueryHandler<GetConsignmentByIdQuery, ConsignmentDetailResponse>
{
    public async Task<ConsignmentDetailResponse> Handle(
        GetConsignmentByIdQuery query, 
        CancellationToken ct)
    {
        var consignment = await repository.GetByIdAsync(query.Id, ct);
        
        return new ConsignmentDetailResponse()
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
        };
    }
} 