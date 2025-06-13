using System;
using System.Collections.Generic;
using FPT_EduTrack.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace FPT_EduTrack.DataAccessLayer.Context;

public partial class FptEduTrackContext : DbContext
{
    public FptEduTrackContext()
    {
    }

    public FptEduTrackContext(DbContextOptions<FptEduTrackContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Exam> Exams { get; set; }

    public virtual DbSet<LecturersTestsDetail> LecturersTestsDetails { get; set; }

    public virtual DbSet<Meeting> Meetings { get; set; }

    public virtual DbSet<MeetingsStatus> MeetingsStatuses { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<ReportFeedback> ReportFeedbacks { get; set; }

    public virtual DbSet<ReportFeedbackStatus> ReportFeedbackStatuses { get; set; }

    public virtual DbSet<ReportStatus> ReportStatuses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Test> Tests { get; set; }

    public virtual DbSet<TestsScore> TestsScores { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=MINQAN141104\\SQLEXPRESS;Initial Catalog= FPT_EduTrack;Persist Security Info=True;User ID=sa;Password=12345;Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exam>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Exams__3213E83FEB161B15");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExaminerId).HasColumnName("examiner_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.Examiner).WithMany(p => p.Exams)
                .HasForeignKey(d => d.ExaminerId)
                .HasConstraintName("FK__Exams__examiner___5441852A");
        });

        modelBuilder.Entity<LecturersTestsDetail>(entity =>
        {
            entity.HasKey(e => new { e.TestId, e.LecturerId }).HasName("PK__Lecturer__FEB201A93F23EBBF");

            entity.ToTable("Lecturers_Tests_Detail");

            entity.Property(e => e.TestId).HasColumnName("test_id");
            entity.Property(e => e.LecturerId).HasColumnName("lecturer_id");
            entity.Property(e => e.Reason).HasColumnName("reason");
            entity.Property(e => e.Score).HasColumnName("score");

            entity.HasOne(d => d.Lecturer).WithMany(p => p.LecturersTestsDetails)
                .HasForeignKey(d => d.LecturerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Lecturers__lectu__5EBF139D");

            entity.HasOne(d => d.Test).WithMany(p => p.LecturersTestsDetails)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Lecturers__test___5DCAEF64");
        });

        modelBuilder.Entity<Meeting>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Meetings__3213E83F1F62A409");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Link).HasColumnName("link");
            entity.Property(e => e.MeetingStatusId).HasColumnName("meeting_status_id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");

            entity.HasOne(d => d.MeetingStatus).WithMany(p => p.Meetings)
                .HasForeignKey(d => d.MeetingStatusId)
                .HasConstraintName("FK__Meetings__meetin__797309D9");

            entity.HasMany(d => d.Users).WithMany(p => p.Meetings)
                .UsingEntity<Dictionary<string, object>>(
                    "MeetingsDetail",
                    r => r.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Meetings___user___7D439ABD"),
                    l => l.HasOne<Meeting>().WithMany()
                        .HasForeignKey("MeetingId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Meetings___meeti__7C4F7684"),
                    j =>
                    {
                        j.HasKey("MeetingId", "UserId").HasName("PK__Meetings__2C22FFDB591DD0A7");
                        j.ToTable("Meetings_Detail");
                        j.IndexerProperty<int>("MeetingId").HasColumnName("meeting_id");
                        j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                    });
        });

        modelBuilder.Entity<MeetingsStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Meetings__3213E83FA0EEBA06");

            entity.ToTable("Meetings_Status");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Report__3213E83FC3963FDA");

            entity.ToTable("Report");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.IsSecond)
                .HasDefaultValue(false)
                .HasColumnName("is_second");
            entity.Property(e => e.ReportStatusId).HasColumnName("report_status_id");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.TestId).HasColumnName("test_id");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.ReportStatus).WithMany(p => p.Reports)
                .HasForeignKey(d => d.ReportStatusId)
                .HasConstraintName("FK__Report__report_s__68487DD7");

            entity.HasOne(d => d.Student).WithMany(p => p.Reports)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Report__student___6754599E");

            entity.HasOne(d => d.Test).WithMany(p => p.Reports)
                .HasForeignKey(d => d.TestId)
                .HasConstraintName("FK__Report__test_id__693CA210");
        });

        modelBuilder.Entity<ReportFeedback>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Report_F__3213E83FF3548D39");

            entity.ToTable("Report_Feedbacks");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.ExaminerId).HasColumnName("examiner_id");
            entity.Property(e => e.Feedback).HasColumnName("feedback");
            entity.Property(e => e.ReExamScore).HasColumnName("re_exam_score");
            entity.Property(e => e.ReportFeedbackStatusId).HasColumnName("report_feedback_status_id");
            entity.Property(e => e.ReportId).HasColumnName("report_id");

            entity.HasOne(d => d.Examiner).WithMany(p => p.ReportFeedbacks)
                .HasForeignKey(d => d.ExaminerId)
                .HasConstraintName("FK__Report_Fe__exami__70DDC3D8");

            entity.HasOne(d => d.ReportFeedbackStatus).WithMany(p => p.ReportFeedbacks)
                .HasForeignKey(d => d.ReportFeedbackStatusId)
                .HasConstraintName("FK__Report_Fe__repor__71D1E811");

            entity.HasOne(d => d.Report).WithMany(p => p.ReportFeedbacks)
                .HasForeignKey(d => d.ReportId)
                .HasConstraintName("FK__Report_Fe__repor__6FE99F9F");
        });

        modelBuilder.Entity<ReportFeedbackStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Report_F__3213E83F007109C9");

            entity.ToTable("Report_Feedback_Status");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<ReportStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Report_S__3213E83F06C65F9C");

            entity.ToTable("Report_Status");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3213E83F339AF7C0");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tests__3213E83F52B570FE");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .HasColumnName("code");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Link).HasColumnName("link");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Student).WithMany(p => p.Tests)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__Tests__student_i__571DF1D5");
        });

        modelBuilder.Entity<TestsScore>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tests_Sc__3213E83F7537D64A");

            entity.ToTable("Tests_Score");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.IsFinal)
                .HasDefaultValue(false)
                .HasColumnName("is_final");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.TestId).HasColumnName("test_id");

            entity.HasOne(d => d.Test).WithMany(p => p.TestsScores)
                .HasForeignKey(d => d.TestId)
                .HasConstraintName("FK__Tests_Sco__test___5AEE82B9");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3213E83FCCBFCA57");

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E616489ADF442").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.ExpiredRefreshToken)
                .HasColumnType("datetime")
                .HasColumnName("expired_refresh_token");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .HasColumnName("fullname");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("is_active");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.RefreshToken).HasColumnName("refresh_token");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__Users__role_id__5070F446");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
