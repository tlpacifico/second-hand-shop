using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Api.Domain.Enums;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.CreateConsignment;

public class CreateConsignmentCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<CreateConsignmentCommand, ConsignmentDetailResponse>
{
    public async Task<ConsignmentDetailResponse> Handle(
        CreateConsignmentCommand command, 
        CancellationToken ct)
    {
        var supplier = await repository.GetSupplierByIdAsync(command.SupplierId, ct);
        
        var consignment = new ConsignmentEntity
        {
            SupplierId = command.SupplierId,
            ConsignmentDate = command.ConsignmentDate,
            Items = new List<ConsignmentItemEntity>(), // Empty list - no items created with consignment
        };
        
        var createdConsignment = await repository.CreateConsignmentAsync(consignment, ct);
        
        return new ConsignmentDetailResponse()
        {
            Id = createdConsignment.Id,
            SupplierId = createdConsignment.SupplierId,
            ConsignmentDate = createdConsignment.ConsignmentDate,
            Items = new List<ConsignmentItemResponse>() // Empty list - no items
        };
    }
} 