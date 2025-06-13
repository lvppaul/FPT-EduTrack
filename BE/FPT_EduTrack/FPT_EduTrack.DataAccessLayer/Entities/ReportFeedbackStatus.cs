using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class ReportFeedbackStatus
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<ReportFeedback> ReportFeedbacks { get; set; } = new List<ReportFeedback>();
}
