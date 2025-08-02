using shs.Application.Abstractions.Messaging;
using shs.Application.Consignment.Models;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment.Queries.SearchSuppliers;

public record SearchSuppliersQuery(int Skip, int Take) : GetPage(Skip, Take), IQuery<PageWithTotal<ConsignmentSupplierResponse>>; 