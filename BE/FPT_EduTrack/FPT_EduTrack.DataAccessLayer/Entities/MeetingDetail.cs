using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Entities
{
    public class MeetingDetail
    {
        public int MeetingId { get; set; }
        public int UserId { get; set; }

        public virtual Meeting Meeting { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }

}
