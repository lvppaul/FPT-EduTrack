using System;
using System.Collections.Generic;

namespace FPT_EduTrack.DataAccessLayer.Entities;

public partial class LecturersTestsDetail
{
    public int TestId { get; set; }

    public int LecturerId { get; set; }

    public double? Score { get; set; }=0;

    public string? Reason { get; set; }

    public bool? isGrading { get; set; } = true;

    public virtual User Lecturer { get; set; } = null!;

    public virtual Test Test { get; set; } = null!;
}
