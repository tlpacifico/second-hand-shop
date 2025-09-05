using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using shs.Api.Presentation.Endpoints.Consignment.Models;
using shs.Database.Database;
using shs.Domain;

namespace shs.Api.Tests.Endpoints;

public class ConsignmentEndpointsTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly ApiWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ConsignmentEndpointsTests(ApiWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateDefaultClient(new ApiCookieHandler(_factory));
    }

    [Fact]
    public async Task CreateConsignment_ReturnsCreated_WithNewConsignment()
    {
        var newConsignmentRequest = new CreateConsignmentRequest(TestConstants.TestSupplierId,
            DateTime.UtcNow);

        // Act
        var response = await _client.PostAsJsonAsync(
            $"{ApiConstants.ConsignmentRoutes.Path}", newConsignmentRequest,
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