using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
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
        public async Task<IEnumerable<ReportDataResponse>> GetAllAsync()
        {
            var reports = await _unitOfWork.ReportRepository.GetAllAsync();
            if (reports == null || !reports.Any())
            {
                return new List<ReportDataResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }
        public async Task<ReportDataResponse> GetByIdAsync(int id)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(id);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {id} not found.");
            }
            return report.ToResponse();
        }
        public async Task<ReportDataResponse> CreateAsync(ReportRequest reportRequest)
        {
            var report = ReportMapper.ToEntity(reportRequest);
            await _unitOfWork.ReportRepository.CreateAsync(report);
            await _unitOfWork.SaveAsync();
            return report.ToResponse();
        }
        public async Task<ReportDataResponse> EditAsync(int id, ReportUpdate report)
        {
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

        public async Task<IEnumerable<ReportDataResponse>> GetReportByStudentId(int studentId)
        {
            var reports = await _unitOfWork.ReportRepository.GetReportsByStudentIdAsync(studentId);
            if (reports == null || !reports.Any())
            {
                return new List<ReportDataResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<ReportDataResponse> GetReportByStudentAndTest(int studentId, int testId)
        {
            var report = await _unitOfWork.ReportRepository.GetReportByStudentAndTestAsync(studentId, testId);
            if(report == null)
            {
                throw new KeyNotFoundException($"Report not found.");
            }
            return report.ToResponse();
        }
    }
}