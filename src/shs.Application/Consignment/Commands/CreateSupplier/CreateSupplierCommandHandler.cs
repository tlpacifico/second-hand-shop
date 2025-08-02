using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Application.Consignment.Models;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.CreateSupplier;

internal class CreateSupplierCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<CreateSupplierCommand, ConsignmentSupplierResponse>
{
    public async Task<ConsignmentSupplierResponse> Handle(
        CreateSupplierCommand command, 
        CancellationToken ct)
    {
        var supplier = new ConsignmentSupplierEntity
        {
            Name = command.Name,
            Email = command.Email,
            PhoneNumber = command.PhoneNumber,
            Address = command.Address,
            Initial = command.Initials,
            CommissionPercentageInCash = command.CommissionPercentageInCash,
            CommissionPercentageInProducts = command.CommissionPercentageInProducts
        };

        var createdSupplier = await repository.CreateSupplierAsync(supplier, ct);
        
        return new ConsignmentSupplierResponse()
        {
            Id = createdSupplier.Id,
            Name = createdSupplier.Name,
            Email = createdSupplier.Email,
            PhoneNumber = createdSupplier.PhoneNumber,
            Address = createdSupplier.Address,
            Initials = createdSupplier.Initial,
            CommissionPercentageInCash = createdSupplier.CommissionPercentageInCash,
            CommissionPercentageInProducts = createdSupplier.CommissionPercentageInProducts
        };
    }
} 