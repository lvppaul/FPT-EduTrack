using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class MeetingsStatus
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<Meeting> Meetings { get; set; } = new List<Meeting>();
}
