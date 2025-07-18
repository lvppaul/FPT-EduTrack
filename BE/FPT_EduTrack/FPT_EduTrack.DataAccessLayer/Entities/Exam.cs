using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class Exam
{
    public int Id { get; set; }

    public string? Code { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Name { get; set; }

    public int? ExaminerId { get; set; }

    public int? Duration { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual User? Examiner { get; set; }

    public virtual ICollection<Test> Tests { get; set; } = new List<Test>();
}
