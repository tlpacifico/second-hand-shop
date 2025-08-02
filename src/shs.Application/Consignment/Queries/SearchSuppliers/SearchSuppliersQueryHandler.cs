using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment.Queries.SearchSuppliers;

internal class SearchSuppliersQueryHandler(
    IConsignmentRepository repository)
    : IQueryHandler<SearchSuppliersQuery, PageWithTotal<ConsignmentSupplierResponse>>
{
    public async Task<PageWithTotal<ConsignmentSupplierResponse>> Handle(
        SearchSuppliersQuery query, 
        CancellationToken ct)
    {
        var result = await repository.SearchSupplierAsync(query.Skip, query.Take, ct);
        
        return new PageWithTotal<ConsignmentSupplierResponse>(
            query.Skip,
            query.Take,
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
            result.Total);
    }
} 