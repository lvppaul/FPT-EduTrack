using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IExamService
    {
        Task<List<ExamResponse>> GetAllAsync(Pagination pagination);
        Task<ExamResponse?> GetExamByIdAsync(int id);
        Task<ExamResponse?> CreateAsync(ExamRequest request);
        Task<ExamResponse?> UpdateExamAsync(int id, ExamRequest request);
        Task<bool> DeleteAsync(int id);
        Task<List<ExamResponse>> GetExamsByUserIdAsync(int userId);
        Task<List<ExamResponse>> GetExamsByStatusAsync(ExamStatus status);
        Task<int> GetTotalExamCountAsync();
        Task<List<ExamResponse>> GetAllAsync();
    }
}
