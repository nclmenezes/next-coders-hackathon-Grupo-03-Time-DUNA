using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NextCoders.Email.Migrations
{
    /// <inheritdoc />
    public partial class RenameEmailLogTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmailLogs",
                table: "EmailLogs");

            migrationBuilder.RenameTable(
                name: "EmailLogs",
                newName: "Emaillogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Emaillogs",
                table: "Emaillogs",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Emaillogs",
                table: "Emaillogs");

            migrationBuilder.RenameTable(
                name: "Emaillogs",
                newName: "EmailLogs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmailLogs",
                table: "EmailLogs",
                column: "Id");
        }
    }
}
