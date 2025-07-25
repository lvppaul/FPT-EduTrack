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

        public async Task<List<LecturersTestsDetail>> GetTestsByLecturer(int lecturerId, bool isGrading = true)
        {
                    var tests = await _context.LecturersTestsDetails
             .Where(ltd => ltd.LecturerId == lecturerId && ltd.isGrading == isGrading)
             .Include(ltd => ltd.Test)
                 .ThenInclude(d => d.Reports.Where(r => r.IsDeleted == false)) // Chỉ include reports còn "sống"
             .Where(d => d.Test.isDeleted == false)
             .ToListAsync();
            return tests;
        }

        public async Task<LecturersTestsDetail> GetLecturerTestDetailByLecturerIdAndTestId(int lecturerId, int testId)
        {
            var lecturerTestDetail = await _context.LecturersTestsDetails
                .Where(ltd => ltd.LecturerId == lecturerId && ltd.TestId == testId)
                .FirstOrDefaultAsync();
            return lecturerTestDetail ;
        }

    }
}
