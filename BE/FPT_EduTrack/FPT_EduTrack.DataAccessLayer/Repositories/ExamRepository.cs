using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class ExamRepository : GenericRepository<Exam>, IExamRepository
    {
        public ExamRepository(FptEduTrackContext context) : base(context)
        {
        }

        public Task AddAsync(Exam exam)
        {
            if(exam == null)
                throw new ArgumentNullException(nameof(exam));
            exam.IsDeleted = false;
            exam.CreatedAt = DateTime.UtcNow;
            _context.Exams.Add(exam);
            return _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if(exam != null)
            {
                exam.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task EditAsync(int id, Exam exam)
        {
            var examItem = await _context.Exams.FindAsync(id);

            if (examItem != null)
            {
                exam.CreatedAt = DateTime.UtcNow;
                exam.Id = examItem.Id;
                _context.Exams.Update(exam);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Exam>> GetAllAsync(Pagination pagination)
        {
            return await _context.Exams
                .Include(m => m.Examiner)
                .Include(m => m.Tests)
                        .ThenInclude(t => t.Student)
                        .Include(e => e.Tests)
                .ThenInclude(t => t.LecturersTestsDetails).ThenInclude(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                .Where(m => m.IsDeleted != true)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
        }

        public override async Task<Exam?> GetByIdAsync(int id)
        {
            return await _context.Exams
                .Include(m => m.Examiner)
                .Include(m => m.Tests)
                    .ThenInclude(t => t.Student)
                 .Include(e => e.Tests)
                .ThenInclude(t => t.LecturersTestsDetails).ThenInclude(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                .FirstOrDefaultAsync(m => m.Id == id && m.IsDeleted != true);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Exams.CountAsync(e => e.IsDeleted != true);
        }

        public async Task<List<Exam>> GetAllAsync()
        {
            return await _context.Exams
                .Include(m => m.Examiner)
                .Include(m => m.Tests).ThenInclude(d => d.Reports)
                        .ThenInclude(t => t.Student)
                        .Include(e => e.Tests)
                .ThenInclude(t => t.LecturersTestsDetails).ThenInclude(ltd => ltd.Lecturer).ThenInclude(l => l.Role)
                .Where(m => m.IsDeleted != true).OrderByDescending(m => m.Id)
                .ToListAsync();
        }
    }
}
