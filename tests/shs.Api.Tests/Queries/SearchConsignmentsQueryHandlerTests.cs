using Moq;
using shs.Application.Consignment.Queries.SearchConsignments;
using shs.Api.Domain.Entities;
using shs.Domain.Infrastructure;
using shs.Domain.Presentation.Models;
using Xunit;

namespace shs.Api.Tests.Queries;

public class SearchConsignmentsQueryHandlerTests
{
    private readonly Mock<IConsignmentRepository> _mockRepository;
    private readonly SearchConsignmentsQueryHandler _handler;

    public SearchConsignmentsQueryHandlerTests()
    {
        _mockRepository = new Mock<IConsignmentRepository>();
        _handler = new SearchConsignmentsQueryHandler(_mockRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidQuery_ReturnsPageWithTotal()
    {
        // Arrange
        var query = new SearchConsignmentsQuery(Skip: 0, Take: 10);

        var consignments = new List<ConsignmentEntity>
        {
            new ConsignmentEntity
            {
                Id = 1,
                SupplierId = 1,
                ConsignmentDate = DateTime.UtcNow,
                Supplier = new ConsignmentSupplierEntity
                {
                    Id = 1,
                    Name = "Test Supplier 1",
                    Email = "test1@example.com",
                    PhoneNumber = "123456789",
                    Initial = "TS1"
                },
                Items = new List<ConsignmentItemEntity>
                {
                    new ConsignmentItemEntity 
                    { 
                        Id = 1,
                        Name = "Item 1",
                        Size = "M",
                        EvaluatedValue = 100.00m,
                        IdentificationNumber = "TS12024120001"
                    },
                    new ConsignmentItemEntity 
                    { 
                        Id = 2,
                        Name = "Item 2",
                        Size = "L",
                        EvaluatedValue = 200.00m,
                        IdentificationNumber = "TS12024120002"
                    }
                }
            },
            new ConsignmentEntity
            {
                Id = 2,
                SupplierId = 2,
                ConsignmentDate = DateTime.UtcNow.AddDays(-1),
                Supplier = new ConsignmentSupplierEntity
                {
                    Id = 2,
                    Name = "Test Supplier 2",
                    Email = "test2@example.com",
                    PhoneNumber = "987654321",
                    Initial = "TS2"
                },
                Items = new List<ConsignmentItemEntity>
                {
                    new ConsignmentItemEntity 
                    { 
                        Id = 3,
                        Name = "Item 3",
                        Size = "S",
                        EvaluatedValue = 150.00m,
                        IdentificationNumber = "TS22024120001"
                    }
                }
            }
        };

        var pageWithTotal = new PageWithTotal<ConsignmentEntity>(
            skip: 0,
            take: 10,
            items: consignments,
            total: 2
        );

        _mockRepository.Setup(r => r.SearchAsync(0, 10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pageWithTotal);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.Skip);
        Assert.Equal(10, result.Take);
        Assert.Equal(2, result.Total);
        Assert.Equal(2, result.Items.Count);

        var firstResult = result.Items.First();
        Assert.Equal(1, firstResult.Id);
        Assert.Equal("Test Supplier 1", firstResult.SupplierName);
        Assert.Equal(2, firstResult.TotalItems);

        var secondResult = result.Items.Skip(1).First();
        Assert.Equal(2, secondResult.Id);
        Assert.Equal("Test Supplier 2", secondResult.SupplierName);
        Assert.Equal(1, secondResult.TotalItems);

        _mockRepository.Verify(r => r.SearchAsync(0, 10, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_EmptyResult_ReturnsEmptyPage()
    {
        // Arrange
        var query = new SearchConsignmentsQuery(Skip: 0, Take: 10);

        var emptyPage = new PageWithTotal<ConsignmentEntity>(
            skip: 0,
            take: 10,
            items: new List<ConsignmentEntity>(),
            total: 0
        );

        _mockRepository.Setup(r => r.SearchAsync(0, 10, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyPage);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.Skip);
        Assert.Equal(10, result.Take);
        Assert.Equal(0, result.Total);
        Assert.Empty(result.Items);
    }
} 