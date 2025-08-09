using shs.Application.Abstractions.Messaging;
using shs.Domain.Application;
using shs.Domain.Application.Model;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment.Queries.SearchConsignments;

public class SearchConsignmentsQueryHandler(
    IConsignmentRepository repository)
    : IQueryHandler<SearchConsignmentsQuery, PageWithTotal<ConsignmentSearchResult>>
{
    public async Task<PageWithTotal<ConsignmentSearchResult>> Handle(
        SearchConsignmentsQuery query, 
        CancellationToken ct)
    {
        var result = await repository.SearchAsync(query.Skip, query.Take, ct);
        
        return new PageWithTotal<ConsignmentSearchResult>(
            query.Skip,
            query.Take,
            result.Items.Select(p => new ConsignmentSearchResult()
            {
                Id = p.Id,
                SupplierName = p.Supplier!.Name,
                ConsignmentDate = p.ConsignmentDate,
                TotalItems = p.Items!.Count,
            }).ToList(),
            result.Total);
    }
} 