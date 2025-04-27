namespace shs.Domain.Application.Model;

public class ConsignmentSearchResult
{
    public long Id { get; set; }
    public DateTime ConsignmentDate { get; set; }
    public required string SupplierName { get; set; }
    public long TotalItems { get; set; }
}