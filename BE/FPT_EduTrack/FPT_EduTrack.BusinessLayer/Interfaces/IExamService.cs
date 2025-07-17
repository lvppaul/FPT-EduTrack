using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IExamService
    {
        Task<List<ExamResponse>> GetAllAsync();
        Task<ExamResponse?> GetByIdAsync(int id);
        Task<ExamResponse> CreateAsync(ExamRequest request);
        Task<ExamResponse> UpdateAsync(int id, ExamRequest request);
        Task DeleteAsync(int id);
        Task<List<ExamResponse>> GetExamsByCourseIdAsync(int courseId);
        Task<List<ExamResponse>> GetExamsByUserIdAsync(int userId);
    }
}
