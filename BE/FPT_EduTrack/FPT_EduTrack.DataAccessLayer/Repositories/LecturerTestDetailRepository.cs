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

        public async Task<LecturersTestsDetail?> GetByCompositeKeyAsync(int testId, int lecturerId)
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .Include(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Student)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Exam)
                    .FirstOrDefaultAsync(ltd => ltd.TestId == testId && ltd.LecturerId == lecturerId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving lecturer test detail for TestId: {testId}, LecturerId: {lecturerId}", ex);
            }
        }

        public async Task<List<LecturersTestsDetail>> GetByTestIdAsync(int testId)
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .Include(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Student)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Exam)
                    .Where(ltd => ltd.TestId == testId)
                    .OrderBy(ltd => ltd.LecturerId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving lecturer test details for TestId: {testId}", ex);
            }
        }

        public async Task<List<LecturersTestsDetail>> GetByLecturerIdAsync(int lecturerId)
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .Include(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Student)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Exam)
                    .Where(ltd => ltd.LecturerId == lecturerId)
                    .OrderByDescending(ltd => ltd.TestId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving lecturer test details for LecturerId: {lecturerId}", ex);
            }
        }

        public async Task<List<LecturersTestsDetail>> GetAllWithIncludesAsync()
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .Include(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Student)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Exam)
                    .OrderByDescending(ltd => ltd.TestId)
                    .ThenBy(ltd => ltd.LecturerId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving all lecturer test details", ex);
            }
        }

        public async Task<bool> IsLecturerAssignedToTestAsync(int testId, int lecturerId)
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .AnyAsync(ltd => ltd.TestId == testId && ltd.LecturerId == lecturerId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error checking if lecturer {lecturerId} is assigned to test {testId}", ex);
            }
        }

        public async Task<List<LecturersTestsDetail>> GetActiveGradersAsync()
        {
            try
            {
                return await _context.Set<LecturersTestsDetail>()
                    .Include(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Student)
                    .Include(ltd => ltd.Test).ThenInclude(t => t.Exam)
                    .Where(ltd => ltd.isGrading == true)
                    .OrderByDescending(ltd => ltd.TestId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving active graders", ex);
            }
        }

        public async Task<bool> RemoveAssignmentAsync(int testId, int lecturerId)
        {
            try
            {
                var assignment = await _context.Set<LecturersTestsDetail>()
                    .FirstOrDefaultAsync(ltd => ltd.TestId == testId && ltd.LecturerId == lecturerId);

                if (assignment == null)
                    return false;

                _context.Set<LecturersTestsDetail>().Remove(assignment);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error removing assignment for TestId: {testId}, LecturerId: {lecturerId}", ex);
            }
        }
    }
}
