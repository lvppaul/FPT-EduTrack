using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Enums;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
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
        public async Task<IEnumerable<ReportResponse>> GetAllPaginationAsync(Pagination pagination)
        {
            var reports = await _unitOfWork.ReportRepository.GetAllPaginationAsync(pagination);
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<IEnumerable<ReportResponse>> GetAllAsync()
        {
            var reports = await _unitOfWork.ReportRepository.GetAllAsync();
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
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
        public async Task<ReportResponse> CreateAsync(ReportRequest reportRequest)
        {
            var report = ReportMapper.ToEntity(reportRequest);
            await _unitOfWork.ReportRepository.CreateAsync(report);
            await _unitOfWork.SaveAsync();
            return report.ToResponse();
        }
        public async Task<ReportResponse> EditAsync(int id, ReportUpdate report)
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

        public async Task<IEnumerable<ReportResponse>> GetReportByStudentIdAsync(int studentId)
        {
            var reports = await _unitOfWork.ReportRepository.GetReportsByStudentIdAsync(studentId);
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<IEnumerable<ReportResponse>> GetReportByStudentIdPaginationAsync(int studentId, Pagination pagination)
        {
            var reports = await _unitOfWork.ReportRepository.GetReportsByStudentIdPaginationAsync(studentId, pagination);
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<ReportResponse> GetReportByStudentAndTestAsync(int studentId, int testId)
        {
            var report = await _unitOfWork.ReportRepository.GetReportByStudentAndTestAsync(studentId, testId);
            if(report == null)
            {
                throw new KeyNotFoundException($"Report not found.");
            }
            return report.ToResponse();
        }

        public async Task<ReportResponse> GetReportByStudentAndTestPaginationAsync(int studentId, int testId, Pagination pagination)
        {
            var report = await _unitOfWork.ReportRepository.GetReportByStudentAndTestPaginationAsync(studentId, testId, pagination);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report not found.");
            }
            return report.ToResponse();
        }

        public async Task<IEnumerable<ReportResponse>> GetReportByStatusAsync(int statusId)
        {
            var listReport = await _unitOfWork.ReportRepository.GetReportByStatusAsync(statusId);
            if (listReport == null)
            {
                throw new KeyNotFoundException($"Reports not found.");
            }
            return listReport.ToDtoList();
        }

        public async Task<IEnumerable<ReportResponse>> GetReportByStatusPaginationAsync(int statusId, Pagination pagination)
        {
            var listReport = await _unitOfWork.ReportRepository.GetReportByStatusPaginationAsync(statusId, pagination);
            if (listReport == null)
            {
                throw new KeyNotFoundException($"Report not found.");
            }
            return listReport.ToDtoList();
        }

        public async Task<List<ReportResponse>> GetReportToReGradingAsync(int lectuerId)
        {
            var reports = await _unitOfWork.ReportRepository.GetReportToReGradingAsync(lectuerId);
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<List<ReportResponse>> GetReportToConfirmedAsync()
        {
            var reports = await _unitOfWork.ReportRepository.GetReportToConfirmedAsync();
            if (reports == null || !reports.Any())
            {
                return new List<ReportResponse>();
            }
            return reports.Select(ReportMapper.ToResponse).ToList();
        }

        public async Task<int> UpdateReportStatusAsync(int reportId, int statusId)
        {
            var check = await _unitOfWork.ReportRepository.GetByIdAsync(reportId);
           
            if (check == null)
            {
                throw new KeyNotFoundException($"Report with ID {reportId} not found.");
            }
            var result = await _unitOfWork.ReportRepository.UpdateReportStatusAsync(reportId, statusId);
            if (result == 0)
            {
                throw new InvalidOperationException($"Failed to update status for report with ID {reportId}.");
            }
           return result;
        }

        public async Task<int> UpdateReportStatusToConfirm(int reportId)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(reportId);   
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {reportId} not found.");
            }
            
            report.ReportStatusId = ReportStatuses.Confirmed; 
            return await _unitOfWork.ReportRepository.UpdateAsync(report);

        }
        public async Task<int> UpdateReportStatusToReject(int reportId)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(reportId);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {reportId} not found.");
            }

            report.ReportStatusId = ReportStatuses.Rejected;
            return await _unitOfWork.ReportRepository.UpdateAsync(report);

        }
        public async Task<int> UpdateReportStatusToGrading(int reportId)
        {
            var report = await _unitOfWork.ReportRepository.GetByIdAsync(reportId);
            if (report == null)
            {
                throw new KeyNotFoundException($"Report with ID {reportId} not found.");
            }

            report.ReportStatusId = ReportStatuses.Grading;
            return await _unitOfWork.ReportRepository.UpdateAsync(report);

        }
    }
}