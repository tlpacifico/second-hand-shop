using Marlo.Common.EntityFrameworkCore.Interceptors;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using shs.Api.Domain.Entities;
using shs.Api.Tests;
using shs.Database.Database;
using shs.Domain;
using Testcontainers.PostgreSql;

[assembly:AssemblyFixture(typeof(ApiWebApplicationFactory))]
namespace shs.Api.Tests;


public class ApiWebApplicationFactory
    : WebApplicationFactory<IMarkerProgram>, IAsyncLifetime 
{
    private readonly PostgreSqlContainer _postgresContainer = new PostgreSqlBuilder()
        .WithImage("postgres:latest")
        .WithDatabase("shs")
        .WithUsername("postgres")
        .WithPassword("Password12!")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        //builder.UseUrls(TestConstants.BaseUrl);

        builder.ConfigureTestServices(services =>
        {
            var companyDescriptor = services.Single(d => d.ServiceType ==
                                                         typeof(DbContextOptions<ShsDbContext>));

            services.Remove(companyDescriptor);

            var connectionString = _postgresContainer.GetConnectionString();

            services.AddDbContext<ShsDbContext>((sp, options) =>
            {
                var createUpdateInterceptor = sp.GetRequiredService<UpdateCreatedUpdatedPropertiesInterceptor>();
                var externalIdInterceptor = sp.GetRequiredService<UpdateExternalIdInterceptor<Guid>>();
                var softDeleteInterceptor = sp.GetRequiredService<SoftDeleteInterceptor>();
                options.UseNpgsql(
                        connectionString,
                        builder => builder.EnableRetryOnFailure()
                    )
                    .AddInterceptors(createUpdateInterceptor, externalIdInterceptor, softDeleteInterceptor);
            });
            
            services.Configure<CookieAuthenticationOptions>(IdentityConstants.ApplicationScheme, options =>
            {
                options.Cookie.Domain = null; // Remove domain restriction for tests
            });

        });

        //builder.UseEnvironment("Development");
    }

    public async ValueTask InitializeAsync()
    {
        await _postgresContainer.StartAsync();
        
        // Set up test data
        var sp = this.Services.CreateScope().ServiceProvider;
        var dbContext = sp.GetRequiredService<ShsDbContext>();
        var userManager = sp.GetRequiredService<UserManager<UserEntity>>();
        
        // Create default user if it doesn't exist
        var defaultUser = await userManager.FindByEmailAsync("admin@example.com");
        if (defaultUser == null)
        {
            defaultUser = new UserEntity
            {
                UserName = TestConstants.TestUserId,
                Email = TestConstants.TestUserId,
                EmailConfirmed = true
            };
            
            var result = await userManager.CreateAsync(defaultUser, TestConstants.TestUserPassword);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create default user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        
        // Add test supplier
        await dbContext.AddAsync(new ConsignmentSupplierEntity()
        {
            Initial = "TLP",
            Name = "Test",
            Email = TestConstants.TestUserId,
            PhoneNumber = "123456789",
            Address = "Test",
            CommissionPercentageInCash = 40,
            CommissionPercentageInProducts = 60
        });

        // Add test brands
        await dbContext.AddRangeAsync(new List<BrandEntity>()
        {
            new BrandEntity()
            {
                Name = "Test",
                Description = "Test"
            },
            new BrandEntity()
            {
                Name = "Test2",
                Description = "Test2"
            }
        });

        // Add test tags
        await dbContext.AddRangeAsync(new List<TagEntity>()
        {
            new TagEntity()
            {
                Name = "Test",
            },
            new TagEntity()
            {
                Name = "Test2",
            }
        });
        
        await dbContext.SaveChangesAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await _postgresContainer.StopAsync();
    }
}