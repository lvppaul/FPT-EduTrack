using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class LecturerTestDetailRepository : GenericRepository<LecturersTestsDetail>, ILecturerTestDetailRepository
    {
        public LecturerTestDetailRepository(FptEduTrackContext context) : base(context)
        {
        }

        
    }
}
