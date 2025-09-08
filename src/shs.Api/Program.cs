using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using shs.Api;
using shs.Api.Domain.Entities;
using shs.Api.Presentation.Endpoints;
using shs.Api.Presentation.Endpoints.Consignment;
using shs.Api.Presentation.Endpoints.Store;
using shs.Api.Presentation.Endpoints.Suppliers;
using shs.Application;
using shs.Database.Database;
using shs.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

try
{
    Log.Information("Starting Second Hand Shop API application");

    // Add Serilog to the logging pipeline
    builder.Host.UseSerilog();

    // Add services to the container.
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    Log.Information("Configuring services...");
    Log.Information("Adding OpenAPI services...");
    builder.Services.AddOpenApi("v1", op =>
    {
        op.AddDocumentTransformer<JwtAuthDocumentTransformer>();
        op.AddOperationTransformer<JwtAuthOperationTransformer>();
    });
    
    Log.Information("Adding database infrastructure...");
    builder.Services.AddDatabaseInfrastructure(builder.Configuration);
    
    Log.Information("Adding application services...");
    builder.Services.AddApplication();
    builder.Services.AddHttpContextAccessor();


    Log.Information("Configuring Firebase JWT authentication...");
    var firebaseConfig = builder.Configuration.GetSection("Firebase");
    var projectId = firebaseConfig["ProjectId"];
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = $"https://securetoken.google.com/{projectId}";
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = $"https://securetoken.google.com/{projectId}",
                ValidateAudience = true,
                ValidAudience = projectId,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

    Log.Information("Adding authorization services...");
    builder.Services.AddAuthorization();


    Log.Information("Configuring CORS...");
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            n =>
                n.WithOrigins("https://app.secondhandstore.local", "http://app.secondhandstore.local", "http://localhost:4200", "https://localhost:4200")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
        );
    });

    Log.Information("Building application...");
    var app = builder.Build();

    // Configure the HTTP request pipeline.
    Log.Information("Configuring HTTP request pipeline...");
    
    if (app.Environment.IsDevelopment())
    {
        Log.Information("Development environment detected - mapping OpenAPI endpoints");
        app.MapOpenApi();
    }

    Log.Information("Applying middleware...");
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();

    Log.Information("Applying database migrations...");
    using var scope = app.Services.CreateScope();
    await scope.ApplyMigrations();

    Log.Information("Configuring CORS and mapping endpoints...");
    app.UseCors("AllowSpecificOrigin");
    app.MapScalarUi();

    Log.Information("Mapping API endpoints...");
    app.MapConsignmentsEndpoints();
    app.MapSuppliersEndpoints();
    app.MapUserEndpoints();
    app.MapStoreEndpoints();

    Log.Information("Application startup completed successfully");
    Log.Information("Starting web server...");
    
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public interface IMarkerProgram
{
}

public class JwtAuthDocumentTransformer : IOpenApiDocumentTransformer
{
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        // Add security scheme definition
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();

        document.Components.SecuritySchemes.Add("Bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Firebase JWT token for authentication"
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
                        Id = "Bearer",
                    }
                },
                Array.Empty<string>()
            }
        });

        return Task.CompletedTask;
    }
}

// Operation Transformer for handling per-endpoint security
public class JwtAuthOperationTransformer : IOpenApiOperationTransformer
{
    public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context,
        CancellationToken cancellationToken)
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
                    Description = "Unauthorized - Invalid or missing JWT token"
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