using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ReportStatus
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
