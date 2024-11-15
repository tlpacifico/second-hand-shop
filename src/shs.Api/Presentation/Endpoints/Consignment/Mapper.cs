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
    
    public static ConsignmentEntity ToEntity(this CreateConsignmentRequest request)
    {
        return new ConsignmentEntity
        {
            SupplierId = request.SupplierId,
            ConsignmentDate = request.ConsignmentDate,
            PickupDate = request.PickupDate,
            Items = request.Items.Select(i => new ConsignmentItemEntity
            {
                Name = i.Name,
                Description = i.Description,
                Price = i.Price
            }).ToList()
        };
    }
}