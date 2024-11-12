using shs.Api.Domain.Entities;
using shs.Api.Presentation.Endpoints.Consignment.Models;

namespace shs.Api.Presentation.Endpoints.Consignment;

public static class Mapper
{
    
    public static ConsignmentSupplierEntity ToEntity(this CreateConsignmentSupplierRequest request)
    {
        return new ConsignmentSupplierEntity
        {
            Name = request.Name,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address
        };
    }
}