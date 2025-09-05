using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using shs.Api;
using shs.Api.Domain.Entities;
using shs.Api.Infrastructure.Database;
using shs.Api.Presentation.Endpoints;
using shs.Api.Presentation.Endpoints.Auth;
using shs.Api.Presentation.Endpoints.Consignment;
using shs.Api.Presentation.Endpoints.Store;
using shs.Api.Presentation.Endpoints.Suppliers;
using shs.Application;
using shs.Database;
using shs.Database.Database;
using shs.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi("v1", op =>
{
    op.AddDocumentTransformer<BearerAuthDocumentTransformer>();
    op.AddOperationTransformer<BearerAuthOperationTransformer>();
});
builder.Services.AddDatabaseInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddHttpContextAccessor();


builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
    {
        
        options.Cookie.Domain = ".secondhandstore.local";
        options.Cookie.Name = ".AspNetCore.Identity.Application";
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
        
    });

builder.Services.AddAuthorization();

builder.Services.AddIdentityCore<UserEntity>(options =>
    {
        options.SignIn.RequireConfirmedAccount = true;
    })
    .AddEntityFrameworkStores<ShsDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        n => 
            n.WithOrigins("https://app.secondhandstore.local", "http://app.secondhandstore.local")
            .AllowAnyHeader()
            .AllowAnyMethod()
        );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


using var scope = app.Services.CreateScope();
await scope.ApplyMigrations();


app.UseCors("AllowSpecificOrigin");
app.MapIdentityApi<UserEntity>();
app.MapScalarUi();

app.MapConsignmentsEndpoints();
app.MapSuppliersEndpoints();
app.MapUserEndpoints();
app.MapStoreEndpoints();

app.Run();

public interface  IMarkerProgram { }

public class BearerAuthDocumentTransformer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
    {
        // Add security scheme definition
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();
        
        document.Components.SecuritySchemes.Add("bearerAuth", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below."
        });

        // Add global security requirement
        document.SecurityRequirements ??= new List<OpenApiSecurityRequirement>();
        document.SecurityRequirements.Add(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "bearerAuth",
                    }
                },
                Array.Empty<string>()
            }
        });

        return Task.CompletedTask;
    }
}

// Operation Transformer for handling per-endpoint security
public class BearerAuthOperationTransformer : IOpenApiOperationTransformer
{
    public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
    {
        // Get endpoint metadata
        var endpoint = context.Description.ActionDescriptor.EndpointMetadata;
        
        // Check for AllowAnonymous attribute
        var allowAnonymous = endpoint.OfType<AllowAnonymousAttribute>().Any();
        
        // Check for Authorize attribute
        var requiresAuth = endpoint.OfType<AuthorizeAttribute>().Any();

        if (allowAnonymous)
        {
            // Remove security requirement for anonymous endpoints
            operation.Security?.Clear();
        }
        else if (requiresAuth)
        {
            // Add authentication responses
            operation.Responses ??= new OpenApiResponses();
            
            if (!operation.Responses.ContainsKey("401"))
            {
                operation.Responses.Add("401", new OpenApiResponse
                {
                    Description = "Unauthorized - Invalid or missing Bearer token"
                });
            }
            
            if (!operation.Responses.ContainsKey("403"))
            {
                operation.Responses.Add("403", new OpenApiResponse
                {
                    Description = "Forbidden - Insufficient permissions"
                });
            }
        }

        return Task.CompletedTask;
    }
}