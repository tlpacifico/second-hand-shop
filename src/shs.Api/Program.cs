using Microsoft.AspNetCore.Identity;
using shs.Api;
using shs.Api.Domain.Entities;
using shs.Api.Infrastructure.Database;
using shs.Api.Presentation.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi("v1");
builder.Services.AddDatabaseInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization();
builder.Services.AddAuthentication()
    .AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddIdentityCore<UserEntity>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
}).AddEntityFrameworkStores<ShsDbContext>()
.AddApiEndpoints();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
}

app.UseHttpsRedirection();


app.MapConsignmentsEndpoints();
using var scope = app.Services.CreateScope();
await scope.ApplyMigrations();

app.MapIdentityApi<UserEntity>();
app.MapScalarUi();
app.Run();

