using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using shs.Api.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace shs.Api.Presentation.Endpoints.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        group.MapPost("/login", LoginAsync)
            .AllowAnonymous()
            .WithName("Login")
            .WithSummary("Authenticate user and return JWT token");

        group.MapPost("/register", RegisterAsync)
            .AllowAnonymous()
            .WithName("Register")
            .WithSummary("Register a new user");

        group.MapGet("/me", GetCurrentUser)
            .RequireAuthorization()
            .WithName("GetCurrentUser")
            .WithSummary("Get current authenticated user information");
    }

    private static async Task<IResult> LoginAsync(
        [FromBody] LoginRequest request,
        UserManager<UserEntity> userManager,
        IConfiguration configuration)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Results.Unauthorized();
        }

        var result = await userManager.CheckPasswordAsync(user, request.Password);
        if (!result)
        {
            return Results.Unauthorized();
        }

        var token = GenerateJwtToken(user, configuration);
        
        return Results.Ok(new { token, user.Email, user.UserName });
    }

    private static async Task<IResult> RegisterAsync(
        [FromBody] RegisterRequest request,
        UserManager<UserEntity> userManager,
        IConfiguration configuration)
    {
        var user = new UserEntity
        {
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true // For demo purposes, you might want to implement email confirmation
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return Results.BadRequest(result.Errors);
        }

        var token = GenerateJwtToken(user, configuration);
        
        return Results.Ok(new { token, user.Email, user.UserName });
    }

    private static IResult GetCurrentUser(ClaimsPrincipal user)
    {
        return Results.Ok(new
        {
            user.Identity?.Name,
            user.FindFirst(ClaimTypes.Email)?.Value,
            user.FindFirst(ClaimTypes.NameIdentifier)?.Value
        });
    }

    private static string GenerateJwtToken(UserEntity user, IConfiguration configuration)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, user.UserName!)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password);

