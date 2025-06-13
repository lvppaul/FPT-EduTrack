using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Meeting
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public string? Link { get; set; }

    public int? MeetingStatusId { get; set; }

    public virtual MeetingsStatus? MeetingStatus { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
