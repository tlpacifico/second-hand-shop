using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;

namespace shs.Application.Consignment.Queries.GetSupplierById;

public record GetSupplierByIdQuery(long Id) : IQuery<ConsignmentSupplierResponse>; 