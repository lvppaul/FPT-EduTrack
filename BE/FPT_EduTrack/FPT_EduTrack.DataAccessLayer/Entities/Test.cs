using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class Test
{
    public int Id { get; set; }

    public string? Code { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public string? Link { get; set; }

    public float? Score { get; set; } = 0;  

    public int? StudentId { get; set; }

    public int? ExamId { get; set; }

    public bool? isDeleted { get; set; } = false;

    public virtual ICollection<LecturersTestsDetail> LecturersTestsDetails { get; set; } = new List<LecturersTestsDetail>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User? Student { get; set; }

    public virtual Exam? Exam { get; set; }

    public virtual ICollection<TestsScore> TestsScores { get; set; } = new List<TestsScore>();
}
