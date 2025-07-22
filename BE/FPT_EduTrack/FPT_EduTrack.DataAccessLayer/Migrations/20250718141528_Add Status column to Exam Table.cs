using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddStatuscolumntoExamTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "Exams",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "Exams");
        }
    }
}
