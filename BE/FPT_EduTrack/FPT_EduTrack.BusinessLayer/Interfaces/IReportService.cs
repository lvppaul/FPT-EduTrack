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
        Task<IEnumerable<ReportResponse>> GetAllAsync();
        Task<ReportResponse> GetByIdAsync(int id);
        Task<ReportResponse> CreateAsync(ReportRequest report);
        Task<ReportResponse> EditAsync(int id, ReportUpdate report);
        Task DeleteAsync(int id);
    }
}
