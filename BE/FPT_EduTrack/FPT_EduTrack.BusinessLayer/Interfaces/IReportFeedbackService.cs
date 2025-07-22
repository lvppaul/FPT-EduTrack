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
    public interface IReportFeedbackService
    {
        Task<IEnumerable<ReportFeedbackResponse>> GetAllAsync(Pagination pagination);
        Task<ReportFeedbackResponse> GetByIdAsync(int id);
        Task<ReportFeedbackResponse> AddAsync(ReportFeedbackRequest request);
        Task DeleteAsync(int id);
        Task<ReportFeedbackResponse> UpdateAsync(int id, ReportFeedbackUpdate update);
    }
}
