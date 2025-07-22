using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class ModifyMeetingTableAddStartTimeEndTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "end_time",
                table: "Meetings",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "start_time",
                table: "Meetings",
                type: "datetime",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "end_time",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "start_time",
                table: "Meetings");
        }
    }
}
