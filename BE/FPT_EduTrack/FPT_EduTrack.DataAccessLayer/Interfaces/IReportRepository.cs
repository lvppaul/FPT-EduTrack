using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IReportRepository : IGenericRepository<Report>
    {
        Task<List<Report>> GetAllPaginationAsync(Pagination pagination);
        Task<List<Report>> GetAllAsync();
        Task<Report> GetByIdAsync(int id);
        Task AddAsync(Report report);
        Task EditAsync(int id, Report report);
        Task DeleteAsync(int id);
        Task<List<Report>> GetReportsByStudentIdAsync(int studentId, Pagination pagination);
        Task<Report> GetReportByStudentAndTestAsync(int studentId, int testId);
    }
}
