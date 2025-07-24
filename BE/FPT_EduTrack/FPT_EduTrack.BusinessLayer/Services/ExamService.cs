using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Repositories;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class ExamService : IExamService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExamService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ExamResponse?> CreateAsync(ExamRequest request)
        {
            var newExam = ExamMapper.ToEntity(request);
            await _unitOfWork.ExamRepository.CreateAsync(newExam);

            var fullExam = await _unitOfWork.ExamRepository.GetByIdAsync(newExam.Id);

            return fullExam == null ? null : ExamMapper.MapToDTO(fullExam);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var exam = await _unitOfWork.ExamRepository.GetByIdAsync(id);
            if (exam == null) return false;

            exam.IsDeleted = true;
            int result = await _unitOfWork.ExamRepository.UpdateAsync(exam);
            return result > 0;
        }

        public async Task<List<ExamResponse>> GetAllAsync(Pagination pagination)
        {
            var exams = await _unitOfWork.ExamRepository.GetAllAsync(pagination);
            if (exams == null || !exams.Any())
            {
                return new List<ExamResponse>();
            }
            return exams.Select(ExamMapper.MapToDTO).ToList();
        }

        public async Task<int> GetTotalExamCountAsync()
        {
            return await _unitOfWork.ExamRepository.CountAsync();
        }

        public async Task<ExamResponse?> GetExamByIdAsync(int id)
        {
            var exam = await _unitOfWork.ExamRepository.GetByIdAsync(id);
            return exam != null ? ExamMapper.MapToDTO(exam) : null;
        }

        public Task<List<ExamResponse>> GetExamsByCourseIdAsync(int courseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ExamResponse>> GetExamsByUserIdAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public async Task<ExamResponse?> UpdateExamAsync(int id, ExamRequest request)
        {
            var existingExam = await _unitOfWork.ExamRepository.GetByIdAsync(id);

            existingExam.ToUpdate(request);
            await _unitOfWork.ExamRepository.UpdateAsync(existingExam);

            var updated = await _unitOfWork.ExamRepository.GetByIdAsync(id);
            return ExamMapper.MapToDTO(updated);
        }

        public async Task<List<ExamResponse>> GetExamsByStatusAsync(ExamStatus status)
        {
            var exams = await _unitOfWork.ExamRepository.GetAllAsync();
            var filtered = exams.Where(e => e.Status == status.ToString());
            return filtered.Select(ExamMapper.MapToDTO).ToList();
        }
        public async Task<List<ExamResponse>> GetAllAsync()
        {
            var exams = await _unitOfWork.ExamRepository.GetAllAsync();
            if (exams == null || !exams.Any())
            {
                return new List<ExamResponse>();
            }
            return exams.Select(ExamMapper.MapToDTO).ToList();
        }
    }
}
