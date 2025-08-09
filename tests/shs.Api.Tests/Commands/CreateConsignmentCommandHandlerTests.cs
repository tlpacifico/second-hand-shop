using Microsoft.Extensions.Logging;
using Moq;
using shs.Application.Consignment.Commands.CreateConsignment;
using shs.Application.Consignment.Models;
using shs.Api.Domain.Entities;
using shs.Domain.Infrastructure;
using Xunit;

namespace shs.Api.Tests.Commands;

public class CreateConsignmentCommandHandlerTests
{
    private readonly Mock<IConsignmentRepository> _mockRepository;
    private readonly CreateConsignmentCommandHandler _handler;

    public CreateConsignmentCommandHandlerTests()
    {
        _mockRepository = new Mock<IConsignmentRepository>();
        _handler = new CreateConsignmentCommandHandler(_mockRepository.Object);
    }

    [Fact]
    public async Task Handle_ValidCommand_ReturnsConsignmentDetailResponse()
    {
        // Arrange
        var command = new CreateConsignmentCommand(
            SupplierId: 1,
            ConsignmentDate: DateTime.UtcNow,
            Items: new List<CreateConsignmentItemCommand>
            {
                new CreateConsignmentItemCommand(
                    Name: "Test Item",
                    Description: "Test Description",
                    EvaluatedValue: 100.00m,
                    Size: "M",
                    BrandId: 1,
                    Color: "Red",
                    TagIds: new List<long> { 1, 2 }
                )
            }
        );

        var supplier = new ConsignmentSupplierEntity
        {
            Id = 1,
            Initial = "TLP",
            Name = "Test Supplier",
            Email = "test@example.com",
            PhoneNumber = "123456789",
            Address = "Test Address",
            CommissionPercentageInCash = 40,
            CommissionPercentageInProducts = 60
        };

        var createdConsignment = new ConsignmentEntity
        {
            Id = 1,
            SupplierId = 1,
            ConsignmentDate = command.ConsignmentDate,
            Items = new List<ConsignmentItemEntity>
            {
                new ConsignmentItemEntity
                {
                    Id = 1,
                    Name = "Test Item",
                    Description = "Test Description",
                    EvaluatedValue = 100.00m,
                    Size = "M",
                    BrandId = 1,
                    Color = "Red",
                    IdentificationNumber = "TLP2024120001",
                    Status = shs.Api.Domain.Enums.ConsignmentStatusType.Evaluated,
                    Tags = new List<ConsignmentItemTagEntity>
                    {
                        new ConsignmentItemTagEntity { TagId = 1 },
                        new ConsignmentItemTagEntity { TagId = 2 }
                    }
                }
            }
        };

        _mockRepository.Setup(r => r.GetSupplierByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(supplier);

        _mockRepository.Setup(r => r.GetLastConsignmentItemOfSupplierAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ConsignmentItemEntity?)null);

        _mockRepository.Setup(r => r.CreateConsignmentAsync(It.IsAny<ConsignmentEntity>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(createdConsignment);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal(1, result.SupplierId);
        Assert.Equal(command.ConsignmentDate, result.ConsignmentDate);
        Assert.Single(result.Items);

        var item = result.Items.First();
        Assert.Equal(1, item.Id);
        Assert.Equal("Test Item", item.Name);
        Assert.Equal("Test Description", item.Description);
        Assert.Equal(100.00m, item.EvaluatedValue);
        Assert.Equal("M", item.Size);
        Assert.Equal(1, item.BrandId);
        Assert.Equal("Red", item.Color);
        Assert.Equal("TLP2024120001", item.IdentificationNumber);
        Assert.Equal(2, item.TagIds.Count);
        Assert.Contains(1, item.TagIds);
        Assert.Contains(2, item.TagIds);

        _mockRepository.Verify(r => r.GetSupplierByIdAsync(1, It.IsAny<CancellationToken>()), Times.Once);
        _mockRepository.Verify(r => r.CreateConsignmentAsync(It.IsAny<ConsignmentEntity>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_SupplierNotFound_ThrowsArgumentException()
    {
        // Arrange
        var command = new CreateConsignmentCommand(
            SupplierId: 999,
            ConsignmentDate: DateTime.UtcNow,
            Items: new List<CreateConsignmentItemCommand>()
        );

        _mockRepository.Setup(r => r.GetSupplierByIdAsync(999, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new ArgumentException("Supplier not found"));

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => 
            _handler.Handle(command, CancellationToken.None));
    }
} 