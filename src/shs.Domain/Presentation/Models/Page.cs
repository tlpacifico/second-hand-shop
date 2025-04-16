namespace shs.Domain.Presentation.Models;

public class Page<TResult>
{
    public Page(int skip, int take, IReadOnlyCollection<TResult> items)
    {
        Skip = skip;
        Take = take;
        Items = items;
    }

    public int Skip { get; }

    public int Take { get; }

    public IReadOnlyCollection<TResult> Items { get; }
}