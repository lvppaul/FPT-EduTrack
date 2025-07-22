using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class ReportFeedbackService : IReportFeedbackService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ReportFeedbackService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ReportFeedbackResponse> AddAsync(ReportFeedbackRequest request)
        {
            var feedback = ReportFeedbackMapper.ToEntity(request);
            await _unitOfWork.ReportFeedbackRepository.CreateAsync(feedback);
            return feedback.ToResponse();
        }

        public async Task DeleteAsync(int id)
        {
            var feedback = await _unitOfWork.ReportFeedbackRepository.GetByIdAsync(id);
            if (feedback == null)
            {
                throw new KeyNotFoundException($"Feedback with ID {id} not found.");
            }
            await _unitOfWork.ReportFeedbackRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ReportFeedbackResponse>> GetAllAsync(Pagination pagination)
        {
            var listFeedback = await _unitOfWork.ReportFeedbackRepository.GetAllAsync(pagination);
            if(listFeedback == null || !listFeedback.Any())
            {
                return new List<ReportFeedbackResponse>();
            }
            return listFeedback.Select(ReportFeedbackMapper.ToResponse).ToList();
        }

        public async Task<ReportFeedbackResponse> GetByIdAsync(int id)
        {
            var feedback = await _unitOfWork.ReportFeedbackRepository.GetByIdAsync(id);
            if(feedback == null)
            {
                throw new KeyNotFoundException($"Feedback with ID {id} not found.");
            }
            return feedback.ToResponse();
        }

        public async Task<ReportFeedbackResponse> UpdateAsync(int id ,ReportFeedbackUpdate update)
        {
            var existingFeedback = await _unitOfWork.ReportFeedbackRepository.GetByIdAsync(id);
            if (existingFeedback == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }
            update.ToUpdate(existingFeedback);
            await _unitOfWork.ReportFeedbackRepository.UpdateAsync(existingFeedback);
            return existingFeedback.ToResponse();
        }
    }
}
