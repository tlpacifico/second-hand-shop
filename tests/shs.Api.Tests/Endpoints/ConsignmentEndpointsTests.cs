using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using shs.Database.Database;
using shs.Domain;

namespace shs.Api.Tests.Endpoints;

public class ConsignmentEndpointsTests : IClassFixture<ApiWebApplicationFactory<Program>>
{
    private readonly ApiWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ConsignmentEndpointsTests(ApiWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateDefaultClient(new ApiCookieHandler());
    }

    [Fact]
    public async Task CreateConsignment_ReturnsCreated_WithNewConsignment()
    {
        var newConsignmentRequest = new CreateConsignmentRequest(TestConstants.TestSupplierId,
            DateTime.UtcNow,
            new List<CreateConsignmentItem>()
            {
                new CreateConsignmentItem("Item 1", "Description 1", 100)
                {
                    Size = "M",
                    BrandId = TestConstants.Brand.Id1,
                    Color = "Red",
                    TagIds = TestConstants.TagIds
                },
                new CreateConsignmentItem("Item 2", "Description 2", 200)
                {
                    Size = "L",
                    BrandId = TestConstants.Brand.Id1,
                    Color = "Blue",
                    TagIds = TestConstants.TagIds
                }
            });

        // Act
        var response = await _client.PostAsJsonAsync(
            $"{ApiConstants.ConsignmentRoutes.Path}/{ApiConstants.ConsignmentRoutes.Create}", newConsignmentRequest,
            cancellationToken: TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);
        Assert.Contains($"{ApiConstants.ConsignmentRoutes.Path}/1", response.Headers.Location.ToString());

        var dbContext = _factory.Services.CreateScope().ServiceProvider.GetService<ShsDbContext>();
        var createdConsignment = await dbContext.Consignments
            .Include(c => c.Supplier)
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == 1, TestContext.Current.CancellationToken);
    }
}