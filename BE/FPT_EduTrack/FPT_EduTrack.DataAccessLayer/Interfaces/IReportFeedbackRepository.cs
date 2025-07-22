using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IReportFeedbackRepository : IGenericRepository<ReportFeedback>
    {
        Task<List<ReportFeedback>> GetAllAsync(Pagination pagination);
        Task<ReportFeedback> GetByIdAsync(int id);
        Task AddAsync(ReportFeedback reportFeedback);
        Task EditAsync(int id, ReportFeedback reportFeedback);
        Task DeleteAsync(int id);
    }
}
