using shs.Application.Abstractions.Messaging;
using shs.Domain.Infrastructure;

namespace shs.Application.Consignment.Commands.DeleteSupplier;

internal class DeleteSupplierCommandHandler(
    IConsignmentRepository repository)
    : ICommandHandler<DeleteSupplierCommand>
{
    public async Task Handle(
        DeleteSupplierCommand command, 
        CancellationToken ct)
    {
        await repository.DeleteSupplierAsync(command.Id, ct);
    }
} 