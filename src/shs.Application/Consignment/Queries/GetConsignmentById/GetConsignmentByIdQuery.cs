using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;

namespace shs.Application.Consignment.Queries.GetConsignmentById;

public record GetConsignmentByIdQuery(long Id) : IQuery<ConsignmentDetailResponse>; 