using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using shs.Domain.Application.Model;



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
            Address = request.Address,
            Initial = request.Initial,
            CommissionPercentageInCash = request.CommissionPercentageInCash,
            CommissionPercentageInProducts = request.CommissionPercentageInProducts,
        };
    }

    public static CreateConsignment ToService(this CreateConsignmentRequest consignment)
    {
        return new CreateConsignment()
        {
            SupplierId = consignment.SupplierId,
            ConsignmentDate = consignment.ConsignmentDate,
            Items = consignment.Items.Select(i => new shs.Domain.Application.Model.CreateConsignmentItem
            {
                Size = i.Size,
                BrandId = i.BrandId,
                Name = i.Name,
                Description = i.Description,
                EvaluatedValue = i.Price,
                Tags = i.TagIds,
                Color = i.Color
            }).ToList()
        };
    }
    
    public static UpdateConsignment ToService(this UpdateConsignmentRequest consignment, long consignmentId)
    {
        return new UpdateConsignment()
        {
            Id = consignmentId,
            SupplierId = consignment.SupplierId,
            ConsignmentDate = consignment.ConsignmentDate,
            NewItems = consignment.NewItems.Select(i => new shs.Domain.Application.Model.CreateConsignmentItem
            {
                Size = i.Size,
                BrandId = i.BrandId,
                Name = i.Name,
                Description = i.Description,
                EvaluatedValue = i.Price,
                Tags = i.TagIds,
                Color = i.Color
            }).ToList(),
            UpdateItems = consignment.Items.Select(i => new shs.Domain.Application.Model.UpdateConsignmentItem
            {
                Id = i.Id,
                Size = i.Size,
                BrandId = i.BrandId,
                Name = i.Name,
                Description = i.Description,
                Color = i.Color,
                EvaluatedValue = i.Price,
            }).ToList(),
            DeletedItemsIds = consignment.DeletedItemsIds.ToList()
        };
    }
}