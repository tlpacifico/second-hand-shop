using Microsoft.EntityFrameworkCore;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using shs.Api.Presentation.Endpoints.Store.Models;
using shs.Database.Database;

namespace shs.Api.Presentation.Endpoints.Store;

public static class StoreEndpoints
{
    public static void MapStoreEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/store").RequireAuthorization();

        group.MapGet("/brands", async (ShsDbContext db, CancellationToken ct) =>
            await db.Brands.Select(p => new BrandResponse(p.Id, p.Name)).ToListAsync(ct));
        
        group.MapGet("/tags", async (ShsDbContext db, CancellationToken ct) =>
            await db.Tags.Select(p => new TagResponse(p.Id, p.Name)).ToListAsync(ct));
    }
}