using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class User
{
    public int Id { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Fullname { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? ExpiredRefreshToken { get; set; }

    public string? Google_refresh_token { get; set; }

    public string? Google_access_token { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? GoogleAccessTokenExpiredAt { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public int? RoleId { get; set; }

    public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();

    public virtual ICollection<LecturersTestsDetail> LecturersTestsDetails { get; set; } = new List<LecturersTestsDetail>();

    public virtual ICollection<ReportFeedback> ReportFeedbacks { get; set; } = new List<ReportFeedback>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual Role? Role { get; set; }

    public virtual ICollection<Test> Tests { get; set; } = new List<Test>();

    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
    public virtual ICollection<MeetingDetail> MeetingDetails { get; set; } = new List<MeetingDetail>();
}
