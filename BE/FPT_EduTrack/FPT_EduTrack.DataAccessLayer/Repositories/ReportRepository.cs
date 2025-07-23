using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class ReportRepository : GenericRepository<Report>, IReportRepository
    {
      
        public ReportRepository(FptEduTrackContext context) : base(context)
        {
        }

        public async Task<List<Report>> GetAllPaginationAsync(Pagination pagination)
        {
            return await _context.Reports
                .Include(r => r.ReportStatus)
                .Include(r => r.Test)
                    .ThenInclude(t => t.Student)
                .Include(r => r.Test)
                    .ThenInclude(t => t.LecturersTestsDetails)
                        .ThenInclude(ld => ld.Lecturer)
                .Where(r => r.IsDeleted == false)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
        }

        public async Task<List<Report>> GetAllAsync()
        {
            return await _context.Reports
                .Include(r => r.ReportStatus)
                .Include(r => r.Test)
                    .ThenInclude(t => t.Student)
                .Include(r => r.Test)
                    .ThenInclude(t => t.LecturersTestsDetails)
                        .ThenInclude(ld => ld.Lecturer)
                .Where(r => r.IsDeleted == false)
                .ToListAsync();
        }

        public override async Task<Report?> GetByIdAsync(int id)
        {
            return await _context.Reports
                .Include(r => r.ReportStatus)
                .Include(r => r.Test)
                    .ThenInclude(t => t.Student)
                .Include(r => r.Test)
                    .ThenInclude(t => t.LecturersTestsDetails)
                        .ThenInclude(ld => ld.Lecturer)
                .FirstOrDefaultAsync(r => r.Id == id && r.IsDeleted != true);
        }

        public async Task AddAsync(Report report)
        {
            if (report == null)
                throw new ArgumentNullException(nameof(report));
            report.IsDeleted = false;
            report.CreatedAt = DateTime.UtcNow;
            report.IsSecond = false;
            report.ReportStatusId = 1;
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }

        public async Task EditAsync(int id, Report report)
        {
            var existingReport = await GetByIdAsync(id);
            if(existingReport != null)
            {
                report.CreatedAt = DateTime.UtcNow;
                report.Id = existingReport.Id;
                _context.Reports.Update(report);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(int id)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);
            if (report != null)
            {
                report.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Report>> GetReportsByStudentIdAsync(int studentId, Pagination pagination)
        {
            return await _context.Reports
                .Where(r => r.StudentId == studentId && r.IsDeleted != true)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
        }

        public async Task<Report> GetReportByStudentAndTestAsync(int studentId, int testId)
        {
            return await _context.Reports
                .Include(r => r.Test)
                    .ThenInclude(t => t.Student)
                .Include(r => r.Test)
                    .ThenInclude(t => t.LecturersTestsDetails)
                        .ThenInclude(ld => ld.Lecturer)
                .FirstOrDefaultAsync(r => r.StudentId == studentId && r.TestId == testId && r.IsDeleted != true);
        }
    }
}
