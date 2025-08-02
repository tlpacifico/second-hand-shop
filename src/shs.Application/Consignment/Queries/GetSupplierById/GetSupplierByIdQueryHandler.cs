using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Queries.GetSupplierById;

internal class GetSupplierByIdQueryHandler(
    IConsignmentRepository repository)
    : IQueryHandler<GetSupplierByIdQuery, ConsignmentSupplierResponse>
{
    public async Task<ConsignmentSupplierResponse> Handle(
        GetSupplierByIdQuery query, 
        CancellationToken ct)
    {
        var supplier = await repository.GetSupplierByIdAsync(query.Id, ct);
        
        return new ConsignmentSupplierResponse()
        {
            Id = supplier.Id,
            Name = supplier.Name,
            Email = supplier.Email,
            PhoneNumber = supplier.PhoneNumber,
            Address = supplier.Address,
            Initials = supplier.Initial,
            CommissionPercentageInCash = supplier.CommissionPercentageInCash,
            CommissionPercentageInProducts = supplier.CommissionPercentageInProducts
        };
    }
} 