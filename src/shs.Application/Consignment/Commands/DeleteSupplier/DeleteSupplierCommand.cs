using shs.Application.Abstractions.Messaging;

namespace shs.Application.Consignment.Commands.DeleteSupplier;

public record DeleteSupplierCommand(long Id) : ICommand; 