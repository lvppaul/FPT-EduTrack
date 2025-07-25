using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IReportService 
    {
        Task<IEnumerable<ReportResponse>> GetAllPaginationAsync(Pagination pagination);
        Task<IEnumerable<ReportResponse>> GetAllAsync();
        Task<ReportResponse> GetByIdAsync(int id);
        Task<ReportResponse> CreateAsync(ReportRequest report);
        Task<ReportResponse> EditAsync(int id, ReportUpdate report);
        Task<IEnumerable<ReportResponse>> GetReportByStudentIdPaginationAsync(int studentId, Pagination pagination);
        Task<IEnumerable<ReportResponse>> GetReportByStudentIdAsync(int studentId);
        Task DeleteAsync(int id);
        Task<ReportResponse> GetReportByStudentAndTestAsync(int studentId, int testId);
        Task<ReportResponse> GetReportByStudentAndTestPaginationAsync(int studentId, int testId, Pagination pagination);
        Task<IEnumerable<ReportResponse>> GetReportByStatusAsync(int statusId);
        Task<IEnumerable<ReportResponse>> GetReportByStatusPaginationAsync(int statusId, Pagination pagination);

        Task<int> UpdateReportStatusAsync(int reportId, int statusId);
        //-----Lecturer Report-----//
        Task<List<ReportResponse>> GetReportToReGradingAsync(int lectuerId);

        // -------head of department report ---- /

        Task<List<ReportResponse>> GetReportToConfirmedAsync();
        Task<int> UpdateReportStatusToConfirm(int reportId);
        Task<int> UpdateReportStatusToReject(int reportId);

        //--- Examiner ---//    
        Task<int> UpdateReportStatusToGrading(int reportId);

        // --- Student---//
        Task<List<ReportResponse>> GetReportByStudentAsync(int studentId);
    }
}
