using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Report
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public bool? IsDeleted { get; set; }

    public bool? IsSecond { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? StudentId { get; set; }

    public int? ReportStatusId { get; set; }

    public int? TestId { get; set; }

    public virtual ICollection<ReportFeedback> ReportFeedbacks { get; set; } = new List<ReportFeedback>();

    public virtual ReportStatus? ReportStatus { get; set; }

    public virtual User? Student { get; set; }

    public virtual Test? Test { get; set; }
}
