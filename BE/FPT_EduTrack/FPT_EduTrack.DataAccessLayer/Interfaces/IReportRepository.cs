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
        Task<List<Report>> GetReportsByStudentIdPaginationAsync(int studentId, Pagination pagination);
        Task<List<Report>> GetReportsByStudentIdAsync(int studentId);
        Task<Report> GetReportByStudentAndTestAsync(int studentId, int testId);
        Task<Report> GetReportByStudentAndTestPaginationAsync(int studentId, int testId, Pagination pagination);
        Task<List<Report>> GetReportByStatusAsync(int statusId);
        Task<List<Report>> GetReportByStatusPaginationAsync(int statusId, Pagination pagination);

        Task<int> UpdateReportStatusAsync(int reportId, int statusId);
        //-----Lecturer Report-----//
        Task<List<Report>> GetReportToReGradingAsync(int lectuerId);
       
        //--  head of department report --//
        Task<List<Report>> GetReportToConfirmedAsync();


         //---Student---//
        Task<List<Report>> GetReportByStudentAsync(int studentId);


    }
}
