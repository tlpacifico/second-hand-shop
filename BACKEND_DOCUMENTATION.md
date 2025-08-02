# LASO Driver API - Backend Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Project Structure](#project-structure)
3. [Clean Architecture Implementation](#clean-architecture-implementation)
4. [Creating Endpoints - Step by Step Guide](#creating-endpoints---step-by-step-guide)
5. [CQRS Pattern Implementation](#cqrs-pattern-implementation)
6. [Dependency Injection Setup](#dependency-injection-setup)
7. [Authentication & Authorization](#authentication--authorization)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## System Architecture Overview

The LASO Driver API follows **Clean Architecture** principles with **CQRS (Command Query Responsibility Segregation)** pattern. The system is built using .NET 8 with minimal APIs and is organized into four main layers:

- **API Layer** (`Driver.Api`) - HTTP endpoints and request/response contracts
- **Application Layer** (`Driver.Application`) - Business logic, commands, queries, and handlers
- **Core Layer** (`Driver.Core`) - Domain entities, interfaces, and business rules
- **Infrastructure Layer** (`Driver.Infrastructure`) - Data access, external services, and implementations

## Project Structure

```
src/
├── Driver.Api/                 # API Layer - HTTP endpoints
│   ├── Endpoints/             # Minimal API endpoint definitions
│   ├── Middleware/            # Custom middleware (error handling, etc.)
│   ├── Contracts/             # Request/Response DTOs
│   └── Program.cs             # Application startup and configuration
├── Driver.Application/         # Application Layer - Business logic
│   ├── Abstractions/          # Interfaces and base classes
│   │   ├── Behaviors/         # Cross-cutting concerns (logging, validation)
│   │   └── Messaging/         # CQRS interfaces (ICommand, IQuery, etc.)
│   ├── [Feature]/             # Feature-based organization
│   │   ├── [Command]/         # Command handlers
│   │   └── [Query]/           # Query handlers
│   └── ApplicationServiceCollection.cs
├── Driver.Core/               # Core Layer - Domain logic
│   ├── Entities/              # Domain entities
│   ├── Interfaces/            # Repository and service interfaces
│   ├── Models/                # Shared models
│   └── Enums/                 # Domain enums
└── Driver.Infrastructure/     # Infrastructure Layer - Data access
    ├── Database/              # Database context and repositories
    ├── HttpClients/           # External HTTP clients
    └── Providers/             # External service providers
```

## Clean Architecture Implementation

### Layer Responsibilities

1. **API Layer** (`Driver.Api`)
   - HTTP endpoint definitions using minimal APIs
   - Request/response mapping
   - Authentication and authorization
   - Middleware configuration

2. **Application Layer** (`Driver.Application`)
   - Business logic implementation
   - Command and Query handlers
   - Validation logic
   - Cross-cutting concerns (logging, validation)

3. **Core Layer** (`Driver.Core`)
   - Domain entities and business rules
   - Repository interfaces
   - Shared models and enums
   - Security interfaces

4. **Infrastructure Layer** (`Driver.Infrastructure`)
   - Database implementations
   - External service integrations
   - Repository implementations

## Creating Endpoints - Step by Step Guide

This guide demonstrates how to create a new endpoint using the **OrderEndpoints** as a reference example.

### Step 1: Define Route Constants

First, define your route constants in `src/Driver.Api/RoutesConstants.cs`:

```csharp
public static class OrderRoutes
{
    public const string Path = $"{RoutesConstants.Base}/orders";
    public const string Search = "";
    public const string GetById = $"{{id:int}}";
    public const string Accept = $"{{id:int}}/accept";
    public const string Conclude = $"{{id:int}}/conclude";
}
```

### Step 2: Create Request/Response DTOs

Create request DTOs in the API layer (if needed):

```csharp
// src/Driver.Api/Contracts/SearchOrderRequest.cs
public record SearchOrderRequest(
    string? OsNumber,
    int Skip,
    int Take);
```

### Step 3: Create Query/Command

In the Application layer, create your query or command:

```csharp
// src/Driver.Application/Order/SearchOrder/SearchOrderQuery.cs
public record SearchOrderQuery(
    string? OsNumber,
    int Skip,
    int Take) : GetPage(Skip, Take), IQuery<PageWithTotal<PagedOrderResult>>;
```

### Step 4: Create Query/Command Handler

Implement the handler with business logic:

```csharp
// src/Driver.Application/Order/SearchOrder/SearchOrderQueryHandler.cs
internal class SearchOrderQueryHandler(
    IIdentityProvider identityProvider, 
    IOrderRepository orderRepository)
    : IQueryHandler<SearchOrderQuery, PageWithTotal<PagedOrderResult>>
{
    public async Task<PageWithTotal<PagedOrderResult>> Handle(
        SearchOrderQuery query, 
        CancellationToken ct)
    {
        var result = await orderRepository.GetAllAsync(
            query.OsNumber, 
            query.Skip, 
            query.Take, 
            identityProvider.DriverId, 
            ct);
        return result.ToModel();
    }
}
```

### Step 5: Create Endpoint

Define the endpoint in your endpoints file:

```csharp
// src/Driver.Api/Endpoints/OrderEndpoints.cs
public static class OrderEndpoints
{
    public static void MapServiceOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(OrderRoutes.Path)
            .RequireAuthorization()
            .WithTags("Orders");

        group.MapGet(OrderRoutes.Search,
            async ([AsParameters] SearchOrderRequest page,
                IQueryHandler<SearchOrderQuery, PageWithTotal<PagedOrderResult>> handler,
                CancellationToken ct) =>
            {
                var result = await handler.Handle(new SearchOrderQuery(
                    page.OsNumber,
                    page.Skip,
                    page.Take), ct);
                return Results.Ok(result);
            })
            .Produces<PageWithTotal<PagedOrderResult>>();
    }
}
```

### Step 6: Register Endpoints

Register your endpoints in `Program.cs`:

```csharp
// In Program.cs
app.MapServiceOrderEndpoints();
```

## CQRS Pattern Implementation

The system implements CQRS (Command Query Responsibility Segregation) pattern:

### Commands (Write Operations)
- Used for operations that change state
- Implement `ICommand` or `ICommand<TResponse>`
- Handled by `ICommandHandler<TCommand>` or `ICommandHandler<TCommand, TResponse>`

```csharp
// Example: AcceptOrderCommand
public record AcceptOrderCommand(int OrderId) : ICommand;

public class AcceptOrderCommandHandler : ICommandHandler<AcceptOrderCommand>
{
    public async Task Handle(AcceptOrderCommand command, CancellationToken ct)
    {
        // Business logic to accept order
    }
}
```

### Queries (Read Operations)
- Used for operations that retrieve data
- Implement `IQuery<TResponse>`
- Handled by `IQueryHandler<TQuery, TResponse>`

```csharp
// Example: GetOrderByIdQuery
public record GetOrderByIdQuery(int Id) : IQuery<GetOrderByIdQueryResult>;

public class GetOrderByIdQueryHandler : IQueryHandler<GetOrderByIdQuery, GetOrderByIdQueryResult>
{
    public async Task<GetOrderByIdQueryResult> Handle(GetOrderByIdQuery query, CancellationToken ct)
    {
        // Business logic to retrieve order
    }
}
```

## Dependency Injection Setup

The system uses automatic registration for handlers:

```csharp
// src/Driver.Application/ApplicationServiceCollection.cs
public static IServiceCollection AddApplication(this IServiceCollection services)
{
    services.Scan(scan => scan.FromAssembliesOf(typeof(ApplicationServiceCollection))
        .AddClasses(classes => classes.AssignableTo(typeof(IQueryHandler<,>)), publicOnly: false)
        .AsImplementedInterfaces()
        .WithScopedLifetime()
        .AddClasses(classes => classes.AssignableTo(typeof(ICommandHandler<>)), publicOnly: false)
        .AsImplementedInterfaces()
        .WithScopedLifetime());
    
    // Add decorators for cross-cutting concerns
    services.Decorate(typeof(IQueryHandler<,>), typeof(LoggingDecorator.QueryHandler<,>));
    services.Decorate(typeof(ICommandHandler<>), typeof(ValidationDecorator.CommandBaseHandler<>));
    
    return services;
}
```

## Authentication & Authorization

The API uses JWT Bearer authentication:

```csharp
// In Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.Authority = builder.Configuration.GetValue<string>("Jwt:Authority");
        options.Audience = builder.Configuration.GetValue<string>("Jwt:Audience");
        // ... JWT configuration
    });

builder.Services.AddAuthorization();
```

Endpoints require authorization:
```csharp
var group = app.MapGroup(OrderRoutes.Path)
    .RequireAuthorization()  // Requires authentication
    .WithTags("Orders");
```

## Error Handling

The system uses custom middleware for error handling:

```csharp
// src/Driver.Api/Middleware/ApiError/ApiErrorHandlerMiddleware.cs
app.UseApiErrorHandler(new ApiErrorHandlerOptions
{
    PathExpression = null!,
    IndentJson = app.Environment.IsDevelopment(),
    IncludeDeveloperDetails = app.Environment.IsDevelopment()
});
```

## Best Practices

### 1. Naming Conventions
- **Commands**: Use imperative verbs (e.g., `AcceptOrderCommand`, `CreateOrderEventCommand`)
- **Queries**: Use descriptive names (e.g., `GetOrderByIdQuery`, `SearchOrderQuery`)
- **Handlers**: Suffix with `Handler` (e.g., `AcceptOrderCommandHandler`)
- **Endpoints**: Use plural nouns (e.g., `OrderEndpoints`, `DriverEndpoints`)

### 2. File Organization
- Organize by feature, then by command/query
- Keep related files together in the same folder
- Use consistent folder structure across features

### 3. Dependency Injection
- Use constructor injection for dependencies
- Keep handlers focused on single responsibility
- Use interfaces for external dependencies

### 4. Error Handling
- Use appropriate HTTP status codes
- Return meaningful error messages
- Log errors appropriately

### 5. Validation
- Use FluentValidation for command validation
- Validate input parameters in handlers
- Return appropriate error responses

### 6. Documentation
- Use XML comments for public APIs
- Document complex business logic
- Keep README files updated

## Example: Complete Endpoint Implementation

Here's a complete example of implementing a new endpoint:

### 1. Route Definition
```csharp
// RoutesConstants.cs
public static class OrderRoutes
{
    public const string GetOrderStatus = $"{{id:int}}/status";
}
```

### 2. Query Definition
```csharp
// GetOrderStatusQuery.cs
public record GetOrderStatusQuery(int OrderId) : IQuery<OrderStatusResult>;

public record OrderStatusResult(string Status, DateTime LastUpdated);
```

### 3. Query Handler
```csharp
// GetOrderStatusQueryHandler.cs
internal class GetOrderStatusQueryHandler : IQueryHandler<GetOrderStatusQuery, OrderStatusResult>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IIdentityProvider _identityProvider;

    public GetOrderStatusQueryHandler(IOrderRepository orderRepository, IIdentityProvider identityProvider)
    {
        _orderRepository = orderRepository;
        _identityProvider = identityProvider;
    }

    public async Task<OrderStatusResult> Handle(GetOrderStatusQuery query, CancellationToken ct)
    {
        var order = await _orderRepository.GetByIdAsync(query.OrderId, ct);
        
        if (order == null)
            throw new NotFoundException($"Order with ID {query.OrderId} not found");
            
        return new OrderStatusResult(order.Status, order.LastUpdated);
    }
}
```

### 4. Endpoint Definition
```csharp
// OrderEndpoints.cs
group.MapGet(OrderRoutes.GetOrderStatus, 
    async ([FromRoute] int id,
        IQueryHandler<GetOrderStatusQuery, OrderStatusResult> handler, 
        CancellationToken ct) =>
    {
        var result = await handler.Handle(new GetOrderStatusQuery(id), ct);
        return Results.Ok(result);
    })
    .Produces<OrderStatusResult>()
    .Produces(StatusCodes.Status404NotFound);
```

This documentation provides a comprehensive guide for new developers to understand and contribute to the LASO Driver API system. The modular architecture and CQRS pattern make the system maintainable and testable while following clean architecture principles. 