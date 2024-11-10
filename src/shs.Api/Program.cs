using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
    }).AddEntityFrameworkStores<ShsDbContext>()
    .AddApiEndpoints();





builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        n => 
            n.WithOrigins("https://app.secondhandstore.local", "http://app.secondhandstore.local")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
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
app.MapGet("/suppliers", async (ShsDbContext db) =>
    await db.ConsignmentSuppliers.ToListAsync()).RequireAuthorization();
app.MapConsignmentsEndpoints();
app.MapUserEndpoints();
// app.UseSpa(spa =>
// {
//     spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
// });
app.Run();

