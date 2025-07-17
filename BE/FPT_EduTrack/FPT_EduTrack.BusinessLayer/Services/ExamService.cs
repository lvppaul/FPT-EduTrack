using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Interfaces;
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

        public async Task<ExamResponse> CreateAsync(ExamRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            var newExam = ExamMapper.ToEntity(request);
            await _unitOfWork.ExamRepository.CreateAsync(newExam);
            await _unitOfWork.SaveAsync();

            var fullExam = await _unitOfWork.ExamRepository.GetByIdAsync(newExam.Id);
            if (fullExam == null)
                throw new Exception("Unexpected error: Exam created but not found in DB.");

            return ExamMapper.MapToDTO(fullExam);
        }

        public async Task DeleteAsync(int id)
        {
            var exam = await _unitOfWork.ExamRepository.GetByIdAsync(id);
            if (exam == null) throw new KeyNotFoundException($"Exam with ID {id} not found.");

            exam.IsDeleted = true;
            await _unitOfWork.ExamRepository.UpdateAsync(exam);
            await _unitOfWork.SaveAsync();
        }

        public async Task<List<ExamResponse>> GetAllAsync()
        {
            var exams = await _unitOfWork.ExamRepository.GetAllAsync(); // Consider using async/await properly
            if (exams == null || !exams.Any())
            {
                return new List<ExamResponse>();
            }
            return exams.Select(ExamMapper.MapToDTO).ToList();
        }

        public async Task<ExamResponse?> GetByIdAsync(int id)
        {
            var exam = await _unitOfWork.ExamRepository.GetByIdAsync(id);
            if (exam == null) throw new KeyNotFoundException($"Exam with ID {id} not found.");

            return ExamMapper.MapToDTO(exam);
        }

        public Task<List<ExamResponse>> GetExamsByCourseIdAsync(int courseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ExamResponse>> GetExamsByUserIdAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public async Task<ExamResponse> UpdateAsync(int id, ExamRequest request)
        {
            var existingExam = await _unitOfWork.ExamRepository.GetByIdAsync(id);

            if (existingExam == null) throw new KeyNotFoundException($"Exam with ID {id} not found.");

            if (request == null) throw new ArgumentNullException(nameof(request));

            existingExam.ToUpdate(request);
            await _unitOfWork.ExamRepository.UpdateAsync(existingExam);
            await _unitOfWork.SaveAsync();

            var updated = await _unitOfWork.ExamRepository.GetByIdAsync(id);

            return ExamMapper.MapToDTO(updated);
        }
    }
}
