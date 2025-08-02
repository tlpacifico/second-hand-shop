using shs.Application.Abstractions.Messaging;

namespace shs.Application.Consignment.Commands.UpdateSupplier;

public record UpdateSupplierCommand(
    long Id,
    string Name,
    string Email,
    string PhoneNumber,
    string Address) : ICommand; 