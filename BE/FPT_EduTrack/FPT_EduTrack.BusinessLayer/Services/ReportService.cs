using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        public ReportService(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }
        public List<Report> GetAllReports()
        {
            return _reportRepository.GetAllReports();
        }
        public Report GetReportById(int id)
        {
            return _reportRepository.GetReportById(id);
        }
        public void AddReport(Report report)
        {
            _reportRepository.AddReport(report);
        }
        public void UpdateReport(Report report)
        {
            _reportRepository.UpdateReport(report);
        }
        public void DeleteReport(int id)
        {
            _reportRepository.DeleteReport(id);
        }
    }
}