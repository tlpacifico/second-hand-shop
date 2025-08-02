using shs.Application.Abstractions.Messaging;
using shs.Api.Domain.Entities;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.UpdateSupplier;

internal class UpdateSupplierCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<UpdateSupplierCommand>
{
    public async Task Handle(
        UpdateSupplierCommand command, 
        CancellationToken ct)
    {
        var supplier = await repository.GetSupplierByIdAsync(command.Id, ct);
        
        if (supplier == null)
            throw new ArgumentException($"Supplier with ID {command.Id} not found");
            
        supplier.Name = command.Name;
        supplier.Email = command.Email;
        supplier.PhoneNumber = command.PhoneNumber;
        supplier.Address = command.Address;
        
        await repository.UpdateSupplierAsync(supplier, ct);
    }
} 