using shs.Application.Abstractions.Messaging;
using shs.Domain.Application.Model;
using shs.Domain.Presentation.Models;

namespace shs.Application.Consignment.Queries.SearchConsignments;

public record SearchConsignmentsQuery(int Skip, int Take) : GetPage(Skip, Take), IQuery<PageWithTotal<ConsignmentSearchResult>>; 