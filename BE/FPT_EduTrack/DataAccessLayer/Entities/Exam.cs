using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Exam
{
    public int Id { get; set; }

    public string? Code { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Name { get; set; }

    public int? ExaminerId { get; set; }

    public virtual User? Examiner { get; set; }
}
