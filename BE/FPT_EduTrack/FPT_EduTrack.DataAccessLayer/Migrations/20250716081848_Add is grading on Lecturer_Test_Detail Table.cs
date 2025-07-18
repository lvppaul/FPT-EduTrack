using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddisgradingonLecturer_Test_DetailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_grading",
                table: "Lecturers_Tests_Detail",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_grading",
                table: "Lecturers_Tests_Detail");
        }
    }
}
