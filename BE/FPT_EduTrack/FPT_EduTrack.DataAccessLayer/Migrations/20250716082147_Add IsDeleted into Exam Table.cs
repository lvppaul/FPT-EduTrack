﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedintoExamTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                table: "Exams",
                type: "bit",
                nullable: true,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_deleted",
                table: "Exams");
        }
    }
}
