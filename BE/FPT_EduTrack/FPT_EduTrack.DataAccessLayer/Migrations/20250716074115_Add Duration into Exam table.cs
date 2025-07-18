using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddDurationintoExamtable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "duration",
                table: "Exams",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duration",
                table: "Exams");
        }
    }
}
