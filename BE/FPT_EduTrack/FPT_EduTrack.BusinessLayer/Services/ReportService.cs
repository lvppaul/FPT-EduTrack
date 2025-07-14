using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ReportService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ReportResponse>> GetAllAsync()
        {
            var reports = await _unitOfWork.ReportRepository.GetAllAsync();
            if (reports == null || !reports.Any())
            {
                return Enumerable.Empty<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }
        public async Task<ReportResponse> GetByIdAsync(int id)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(id);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }
            return report.ToResponse();
        }
        public async Task<ReportResponse> CreateAsync(ReportRequest report)
        {
            if (report == null)
            {
                throw new ArgumentNullException(nameof(report), "Report cannot be null.");
            }
            var newReport = ReportMapper.ToEntity(report);
            await _unitOfWork.ReportRepository.CreateAsync(newReport);
            await _unitOfWork.SaveAsync();
            return newReport.ToResponse();
        }
        public async Task<ReportResponse> EditAsync(int id, ReportUpdate report)
        {
            if (report == null)
            {
                throw new ArgumentNullException(nameof(report), "Report cannot be null.");
            }
            var existingReport = await _unitOfWork.ReportRepository.GetByIdAsync(id);
            if (existingReport == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }
            report.ToUpdate(existingReport);
            await _unitOfWork.ReportRepository.UpdateAsync(existingReport);
            await _unitOfWork.SaveAsync();
            return existingReport.ToResponse();
        }
        public async Task DeleteAsync(int id)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(id);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }

            report.IsDeleted = true;
            await _unitOfWork.ReportRepository.UpdateAsync(report);
            await _unitOfWork.SaveAsync();
        }
    }
}