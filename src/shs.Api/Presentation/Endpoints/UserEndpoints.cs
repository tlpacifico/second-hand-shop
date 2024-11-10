using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using shs.Api.Domain.Entities;

namespace shs.Api.Presentation.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user");
        
        group.MapGet("/me", async (ClaimsPrincipal user) =>
        {
            return
                Results.Ok(new 
                {
                    Email = user.FindFirstValue(ClaimTypes.Email),
                    UserName = user.FindFirstValue(ClaimTypes.NameIdentifier),
                    Expires = user.FindFirstValue(ClaimTypes.Expiration)
                });

        }).RequireAuthorization();
    }
}