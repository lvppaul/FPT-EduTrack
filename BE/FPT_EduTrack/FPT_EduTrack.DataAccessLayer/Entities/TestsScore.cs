using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class TestsScore
{
    public int Id { get; set; }

    public double? Score { get; set; }

    public bool? IsFinal { get; set; }

    public int? TestId { get; set; }

    public virtual Test? Test { get; set; }
}
