using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPT_EduTrack.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class ModifyUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Meetings_Status",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Meetings__3213E83F10968B67", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Report_Feedback_Status",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report_F__3213E83F98424F8C", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Report_Status",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report_S__3213E83FA0238267", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Roles__3213E83F8AFA5467", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Meetings",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    link = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    meeting_status_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Meetings__3213E83FDDFCD55F", x => x.id);
                    table.ForeignKey(
                        name: "FK__Meetings__meetin__797309D9",
                        column: x => x.meeting_status_id,
                        principalTable: "Meetings_Status",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    fullname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    refresh_token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    expired_refresh_token = table.Column<DateTime>(type: "datetime", nullable: true),
                    google_refresh_token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    google_access_token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    is_active = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    role_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__3213E83FAF6D8416", x => x.id);
                    table.ForeignKey(
                        name: "FK__Users__role_id__5070F446",
                        column: x => x.role_id,
                        principalTable: "Roles",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    examiner_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Exams__3213E83FFCBF6A48", x => x.id);
                    table.ForeignKey(
                        name: "FK__Exams__examiner___5441852A",
                        column: x => x.examiner_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Meetings_Detail",
                columns: table => new
                {
                    meeting_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Meetings__2C22FFDB6A6F7074", x => new { x.meeting_id, x.user_id });
                    table.ForeignKey(
                        name: "FK__Meetings___meeti__7C4F7684",
                        column: x => x.meeting_id,
                        principalTable: "Meetings",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Meetings___user___7D439ABD",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    link = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    student_id = table.Column<int>(type: "int", nullable: true),
                    exam_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Tests__3213E83F3115D372", x => x.id);
                    table.ForeignKey(
                        name: "FK__Tests__exam_id__5AEE82B9",
                        column: x => x.exam_id,
                        principalTable: "Exams",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Tests__student_i__571DF1D5",
                        column: x => x.student_id,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Lecturers_Tests_Detail",
                columns: table => new
                {
                    test_id = table.Column<int>(type: "int", nullable: false),
                    lecturer_id = table.Column<int>(type: "int", nullable: false),
                    score = table.Column<double>(type: "float", nullable: true),
                    reason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Lecturer__FEB201A960272DB1", x => new { x.test_id, x.lecturer_id });
                    table.ForeignKey(
                        name: "FK__Lecturers__lectu__5EBF139D",
                        column: x => x.lecturer_id,
                        principalTable: "Users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Lecturers__test___5DCAEF64",
                        column: x => x.test_id,
                        principalTable: "Tests",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    is_second = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    student_id = table.Column<int>(type: "int", nullable: true),
                    report_status_id = table.Column<int>(type: "int", nullable: true),
                    test_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report__3213E83F976C4D9F", x => x.id);
                    table.ForeignKey(
                        name: "FK__Report__report_s__68487DD7",
                        column: x => x.report_status_id,
                        principalTable: "Report_Status",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Report__student___6754599E",
                        column: x => x.student_id,
                        principalTable: "Users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Report__test_id__693CA210",
                        column: x => x.test_id,
                        principalTable: "Tests",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Tests_Score",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    score = table.Column<double>(type: "float", nullable: true),
                    is_final = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    test_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Tests_Sc__3213E83F455B4163", x => x.id);
                    table.ForeignKey(
                        name: "FK__Tests_Sco__test___5AEE82B9",
                        column: x => x.test_id,
                        principalTable: "Tests",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Report_Feedbacks",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    report_id = table.Column<int>(type: "int", nullable: true),
                    examiner_id = table.Column<int>(type: "int", nullable: true),
                    feedback = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    report_feedback_status_id = table.Column<int>(type: "int", nullable: true),
                    re_exam_score = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Report_F__3213E83F321DE8A4", x => x.id);
                    table.ForeignKey(
                        name: "FK__Report_Fe__exami__70DDC3D8",
                        column: x => x.examiner_id,
                        principalTable: "Users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Report_Fe__repor__6FE99F9F",
                        column: x => x.report_id,
                        principalTable: "Report",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__Report_Fe__repor__71D1E811",
                        column: x => x.report_feedback_status_id,
                        principalTable: "Report_Feedback_Status",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exams_examiner_id",
                table: "Exams",
                column: "examiner_id");

            migrationBuilder.CreateIndex(
                name: "IX_Lecturers_Tests_Detail_lecturer_id",
                table: "Lecturers_Tests_Detail",
                column: "lecturer_id");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_meeting_status_id",
                table: "Meetings",
                column: "meeting_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_Detail_user_id",
                table: "Meetings_Detail",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_report_status_id",
                table: "Report",
                column: "report_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_student_id",
                table: "Report",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_test_id",
                table: "Report",
                column: "test_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Feedbacks_examiner_id",
                table: "Report_Feedbacks",
                column: "examiner_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Feedbacks_report_feedback_status_id",
                table: "Report_Feedbacks",
                column: "report_feedback_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Feedbacks_report_id",
                table: "Report_Feedbacks",
                column: "report_id");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_exam_id",
                table: "Tests",
                column: "exam_id");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_student_id",
                table: "Tests",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_Score_test_id",
                table: "Tests_Score",
                column: "test_id");

            migrationBuilder.CreateIndex(
                name: "IX_Users_role_id",
                table: "Users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__AB6E6164A295357C",
                table: "Users",
                column: "email",
                unique: true,
                filter: "[email] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lecturers_Tests_Detail");

            migrationBuilder.DropTable(
                name: "Meetings_Detail");

            migrationBuilder.DropTable(
                name: "Report_Feedbacks");

            migrationBuilder.DropTable(
                name: "Tests_Score");

            migrationBuilder.DropTable(
                name: "Meetings");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "Report_Feedback_Status");

            migrationBuilder.DropTable(
                name: "Meetings_Status");

            migrationBuilder.DropTable(
                name: "Report_Status");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropTable(
                name: "Exams");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
