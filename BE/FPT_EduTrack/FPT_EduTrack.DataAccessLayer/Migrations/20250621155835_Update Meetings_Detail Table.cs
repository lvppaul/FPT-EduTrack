using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMeetings_DetailTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__Meetings___meeti__7C4F7684",
                table: "Meetings_Detail");

            migrationBuilder.DropForeignKey(
                name: "FK__Meetings___user___7D439ABD",
                table: "Meetings_Detail");

            migrationBuilder.DropPrimaryKey(
                name: "PK__Meetings__2C22FFDB6A6F7074",
                table: "Meetings_Detail");

            migrationBuilder.RenameColumn(
                name: "google_refresh_token",
                table: "Users",
                newName: "Google_refresh_token");

            migrationBuilder.RenameColumn(
                name: "google_access_token",
                table: "Users",
                newName: "Google_access_token");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Meetings_Detail",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "meeting_id",
                table: "Meetings_Detail",
                newName: "MeetingId");

            migrationBuilder.RenameIndex(
                name: "IX_Meetings_Detail_user_id",
                table: "Meetings_Detail",
                newName: "IX_Meetings_Detail_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Meetings_Detail",
                table: "Meetings_Detail",
                columns: new[] { "MeetingId", "UserId" });

            migrationBuilder.CreateTable(
                name: "MeetingUser",
                columns: table => new
                {
                    MeetingsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingUser", x => new { x.MeetingsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_MeetingUser_Meetings_MeetingsId",
                        column: x => x.MeetingsId,
                        principalTable: "Meetings",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingUser_UsersId",
                table: "MeetingUser",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_Detail_Meetings_MeetingId",
                table: "Meetings_Detail",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_Detail_Users_UserId",
                table: "Meetings_Detail",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_Detail_Meetings_MeetingId",
                table: "Meetings_Detail");

            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_Detail_Users_UserId",
                table: "Meetings_Detail");

            migrationBuilder.DropTable(
                name: "MeetingUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Meetings_Detail",
                table: "Meetings_Detail");

            migrationBuilder.RenameColumn(
                name: "Google_refresh_token",
                table: "Users",
                newName: "google_refresh_token");

            migrationBuilder.RenameColumn(
                name: "Google_access_token",
                table: "Users",
                newName: "google_access_token");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Meetings_Detail",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "MeetingId",
                table: "Meetings_Detail",
                newName: "meeting_id");

            migrationBuilder.RenameIndex(
                name: "IX_Meetings_Detail_UserId",
                table: "Meetings_Detail",
                newName: "IX_Meetings_Detail_user_id");

            migrationBuilder.AddPrimaryKey(
                name: "PK__Meetings__2C22FFDB6A6F7074",
                table: "Meetings_Detail",
                columns: new[] { "meeting_id", "user_id" });

            migrationBuilder.AddForeignKey(
                name: "FK__Meetings___meeti__7C4F7684",
                table: "Meetings_Detail",
                column: "meeting_id",
                principalTable: "Meetings",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK__Meetings___user___7D439ABD",
                table: "Meetings_Detail",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id");
        }
    }
}
