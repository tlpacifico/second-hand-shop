using Marlo.Common.EntityFrameworkCore.Interceptors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using shs.Api.Domain.Entities;
using shs.Api.Tests;
using shs.Database.Database;
using Testcontainers.PostgreSql;
using Xunit.Sdk;
using Xunit.v3;
[assembly:AssemblyFixture(typeof(ApiWebApplicationFactory<Program>))]
namespace shs.Api.Tests;


public class ApiWebApplicationFactory<TProgram>
    : WebApplicationFactory<TProgram> , IAsyncLifetime where TProgram : class
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("sibedge/postgres-plv8")
        .WithDatabase("shs")
        .WithUsername("postgres")
        .WithPassword("Password12!")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseUrls(TestConstants.BaseUrl);

        builder.ConfigureTestServices(services =>
        {
            var companyDescriptor = services.Single(d => d.ServiceType ==
                                                         typeof(DbContextOptions<ShsDbContext>));

            services.Remove(companyDescriptor);

            var connectionString = _container.GetConnectionString();

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
        });

        builder.UseEnvironment("Development");
    }
   
    // public async ValueTask StartAsync(IMessageSink diagnosticMessageSink)
    // {
    //     var sp = this.Services.CreateScope().ServiceProvider;
    //
    //     var userManager = sp.GetRequiredService<UserManager<UserEntity>>();
    //  
    //
    //     var userStore = sp.GetRequiredService<IUserStore<UserEntity>>();
    //     var emailStore = (IUserEmailStore<UserEntity>)userStore;
    //     var email = TestConstants.TestUserId;
    //
    //   
    //     var user = new UserEntity();
    //     await userStore.SetUserNameAsync(user, email, CancellationToken.None);
    //     await emailStore.SetEmailAsync(user, email, CancellationToken.None);
    //     var result = await userManager.CreateAsync(user, "Password12!");
    //     
    //     var token = await userManager.GenerateChangeEmailTokenAsync(user, email);
    //     
    //     await userManager.ConfirmEmailAsync(user, token);
    //     
    //     var dbContext = sp.GetRequiredService<ShsDbContext>();
    //     await dbContext.AddAsync(new ConsignmentSupplierEntity()
    //     {
    //         Initial = "TLP",
    //         Name = "Test",
    //         Email = email,
    //         PhoneNumber = "123456789",
    //         Address = "Test",
    //         CommissionPercentageInCash = 40,
    //         CommissionPercentageInProducts = 60
    //     });
    //
    //     await dbContext.AddRangeAsync(new List<BrandEntity>()
    //     {
    //         new BrandEntity()
    //         {
    //             Name = "Test",
    //             Description = "Test",
    //             CreatedBy = user.Id,
    //             UpdatedBy = user.Id
    //         },
    //         new BrandEntity()
    //         {
    //             Name = "Test2",
    //             Description = "Test2",
    //             CreatedBy = user.Id,
    //             UpdatedBy = user.Id
    //         }
    //     });
    //
    //     await dbContext.AddRangeAsync(new List<TagEntity>()
    //     {
    //         new TagEntity()
    //         {
    //             Name = "Test",
    //         },
    //         new TagEntity()
    //         {
    //             Name = "Test2",
    //         }
    //     });
    //     await dbContext.SaveChangesAsync();
    // }

    public async ValueTask StopAsync()
    {
        await _container.StopAsync();
    }

    public async ValueTask InitializeAsync()
    {
        await _container.StartAsync();
    }
}