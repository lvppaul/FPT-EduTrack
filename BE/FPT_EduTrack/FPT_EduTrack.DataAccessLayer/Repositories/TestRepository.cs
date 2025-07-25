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
    public class TestRepository : GenericRepository<Test>, ITestRepository
    {
        public TestRepository(FptEduTrackContext context) : base(context)
        {
        }

       

        public async  Task<List<Test>> GetTestsAsync()
        {
            try
            {
                return  await _context.Tests
                    .Include(t => t.TestsScores)
                    .Include(t => t.Student)
                    .Include(t => t.Reports)
                    .Include(t => t.LecturersTestsDetails)
                        .ThenInclude(ltd => ltd.Lecturer).ThenInclude(s => s.Role)
                    .Include(t => t.Exam).OrderByDescending(t => t.Id)
                    .ToListAsync();
            }
            catch (Exception e)
            {

                throw new Exception("Error at GetTestsAsync at TestRepository", e);
            }
        }

        public async Task<List<Test>> GetTestsByStudentIdAsync(int studentId)
        {
            try
            {
                return await _context.Tests
                    .Include(t => t.TestsScores)
                    .Include(t => t.Student)
                    .Include(t => t.Reports)
                    .Include(t => t.LecturersTestsDetails)
                        .ThenInclude(ltd => ltd.Lecturer).ThenInclude(s => s.Role)
                    .Include(t => t.Exam)
                    .Where(t => t.StudentId == studentId)
                    .OrderByDescending(t => t.Id)
                    .ToListAsync();
            }
            catch (Exception e)
            {

                throw new Exception("GetTestByStudentId Repository error: "+ e);
            }
        }

        public async Task<bool> IsLecturerAssigned(int lecturerId, int testId)
        {
            try
            {
                return await _context.LecturersTestsDetails
                    .AnyAsync(ltd => ltd.LecturerId == lecturerId && ltd.TestId == testId);
            }
            catch (Exception e)
            {
                throw new Exception("Error at IsLecturerAssigned at TestRepository", e);
            }
        }
    }
}
