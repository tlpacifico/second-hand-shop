using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shs.Database.Migrations
{
    /// <inheritdoc />
    public partial class ConsignmentItemAddColorColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "ConsignmentItems",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "ConsignmentItems");
        }
    }
}
