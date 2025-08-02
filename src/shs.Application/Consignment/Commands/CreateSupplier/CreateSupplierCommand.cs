using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;

namespace shs.Application.Consignment.Commands.CreateSupplier;

public record CreateSupplierCommand(
    string Name,
    string Email,
    string PhoneNumber,
    string Address,
    string Initials,
    decimal CommissionPercentageInCash,
    decimal CommissionPercentageInProducts) : ICommand<ConsignmentSupplierResponse>; 