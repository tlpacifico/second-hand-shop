namespace shs.Domain.Presentation.Models;

public class PageWithTotal<TResult> : Page<TResult>
{
    public PageWithTotal(int skip, int take, IReadOnlyCollection<TResult> items, int total)
        : base(skip, take, items)
    {
        Total = total;
    }

    public int Total { get; }
}