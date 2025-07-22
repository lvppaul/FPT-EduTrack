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
    public class ReportFeedbackRepository : GenericRepository<ReportFeedback>, IReportFeedbackRepository
    {
        public ReportFeedbackRepository(FptEduTrackContext context) : base(context)
        {
        }
        public async Task AddAsync(ReportFeedback reportFeedback)
        {
            _context.Add(reportFeedback);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var feedback = await GetByIdAsync(id);
            if(feedback != null)
            {
                _context.Remove(feedback);
                await _context.SaveChangesAsync();
            }
        }

        public async Task EditAsync(int id, ReportFeedback reportFeedback)
        {
            var feedback = await GetByIdAsync(id);
            if (feedback != null)
            {
                reportFeedback.Id = id;
                _context.Update(reportFeedback);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<ReportFeedback>> GetAllAsync(Pagination pagination)
        {
            return await _context.ReportFeedbacks.ToListAsync();
        }

        public override async Task<ReportFeedback> GetByIdAsync(int id)
        {
            return await _context.ReportFeedbacks.FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}
