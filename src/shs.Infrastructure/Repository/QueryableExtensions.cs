using System.Linq.Expressions;
using Marlo.Common.EntityFrameworkCore.Contracts;
using Marlo.Common.EntityFrameworkCore.Extensions;
using Marlo.Common.EntityFrameworkCore.Repositories;
using Marlo.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using shs.Domain.Presentation.Models;

namespace shs.Database.Repository;

public static class QueryableExtensions
{
    public static async Task<PageWithTotal<TResult>> AsPageWithTotalAsync<T, TResult>(this IQueryable<T> query,
        Expression<Func<T, TResult>> mapper, int? skip, int? take, CancellationToken ct)
        where T : class
    {

        var total = await query.CountAsync(ct);
        var s = skip ?? 0;
        var t = take ?? 20;
        //if (t > options.PageTakeMax)
        //    t = options.PageTakeMax;
        IReadOnlyCollection<TResult> items;
        if (s >= total || t == 0)
            items = Array.Empty<TResult>();
        else
        {
            items = await query
                .Skip(s)
                .Take(t)
                .AsNoTracking()
                .Select(mapper)
                .ToListAsync(ct);
        }
        return new PageWithTotal<TResult>(s, t, items, total);
    }
    public static async Task<PageWithTotal<T>> AsPageWithTotalAsync<T>(this IQueryable<T> query,
        int? skip, int? take, CancellationToken ct)
        where T : class
    {

        var total = await query.CountAsync(ct);
        var s = skip ?? 0;
        var t = take ?? 20;
        //if (t > options.PageTakeMax)
        //    t = options.PageTakeMax;
        IReadOnlyCollection<T> items;
        if (s >= total || t == 0)
            items = Array.Empty<T>();
        else
        {
            items = await query
                .Skip(s)
                .Take(t)
                .AsNoTracking()
                .ToListAsync(ct);
        }
        return new PageWithTotal<T>(s, t, items, total);
    }
    
    public static async Task<T> GetByIdAndEnsureExistsAsync<T>(this DbSet<T> repository, long id, CancellationToken ct)
        where T : class, IHaveId<long>
    {
        var entity = await repository.SingleOrDefaultAsync(e => e.Id.Equals(id), ct);

        if (entity is null)
            throw new NotFoundException($"No entry exists with id of {id}");

        return entity;
    }
}