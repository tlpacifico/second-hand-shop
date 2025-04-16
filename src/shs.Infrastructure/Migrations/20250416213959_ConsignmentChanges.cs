using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shs.Database.Migrations
{
    /// <inheritdoc />
    public partial class ConsignmentChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CommissionPercentageInCash",
                table: "ConsignmentSuppliers",
                type: "numeric(4,2)",
                precision: 4,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CommissionPercentageInProducts",
                table: "ConsignmentSuppliers",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Initial",
                table: "ConsignmentSuppliers",
                type: "character varying(3)",
                maxLength: 3,
                precision: 4,
                scale: 2,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommissionPercentageInCash",
                table: "ConsignmentSuppliers");

            migrationBuilder.DropColumn(
                name: "CommissionPercentageInProducts",
                table: "ConsignmentSuppliers");

            migrationBuilder.DropColumn(
                name: "Initial",
                table: "ConsignmentSuppliers");
        }
    }
}
