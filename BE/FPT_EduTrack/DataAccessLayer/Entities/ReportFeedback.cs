using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ReportFeedback
{
    public int Id { get; set; }

    public int? ReportId { get; set; }

    public int? ExaminerId { get; set; }

    public string? Feedback { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? ReportFeedbackStatusId { get; set; }

    public double? ReExamScore { get; set; }

    public virtual User? Examiner { get; set; }

    public virtual Report? Report { get; set; }

    public virtual ReportFeedbackStatus? ReportFeedbackStatus { get; set; }
}
