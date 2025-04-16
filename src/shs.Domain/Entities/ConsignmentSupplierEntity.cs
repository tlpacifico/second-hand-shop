using Marlo.Common.EntityFrameworkCore.Contracts;

namespace shs.Api.Domain.Entities;

public class ConsignmentSupplierEntity : EntityWithIdAuditable<long>, IHaveSoftDelete
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    
    public required string Initial { get; init; }

    public decimal CommissionPercentageInCash { get; set; }
    public decimal CommissionPercentageInProducts { get; set; }
    public string? Address { get; set; }
    public bool IsDeleted { get; set; }
    public string? DeletedBy { get; set; }
    public DateTime? DeletedOn { get; set; }
}