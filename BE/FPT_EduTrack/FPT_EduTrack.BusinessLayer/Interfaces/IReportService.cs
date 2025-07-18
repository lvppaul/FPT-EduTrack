using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IReportService 
    {
        Task<IEnumerable<ReportDataResponse>> GetAllAsync();
        Task<ReportDataResponse> GetByIdAsync(int id);
        Task<ReportDataResponse> CreateAsync(ReportRequest report);
        Task<ReportDataResponse> EditAsync(int id, ReportUpdate report);
        Task<IEnumerable<ReportDataResponse>> GetReportByStudentId(int studentId);
        Task DeleteAsync(int id);
        Task<ReportDataResponse> GetReportByStudentAndTest(int studentId, int testId);
    }
}
