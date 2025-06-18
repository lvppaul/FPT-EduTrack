using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }
        [HttpGet]
        public ActionResult<List<ReportResponse>> GetAllReports()
        {
            var reports = _reportService.GetAllReports();
            var responseList = reports.Select(report => new ReportResponse
            {
                Id = report.Id,
                Title = report.Title,
                Content = report.Content,
                IsSecond = report.IsSecond,
                CreatedAt = report.CreatedAt,
                StudentId = report.StudentId,
                TestId = report.TestId
            }).ToList();

            return Ok(responseList);
        }

        [HttpGet("id")]
        public ActionResult<ReportResponse> GetReportByID(int id)
        {
            var report = _reportService.GetReportById(id);
            if (report == null)
            {
                return NotFound($"Report with ID {id} not found.");
            }

            var response = new ReportResponse
            {
                Id = report.Id,
                Title = report.Title,
                Content = report.Content,
                IsSecond = report.IsSecond,
                CreatedAt = report.CreatedAt,
                StudentId = report.StudentId,
                TestId = report.TestId
            };

            return Ok(response);
        }

        [HttpPost]
        public ActionResult<ReportResponse> CreateReport([FromBody] ReportRequest request)
        {
            var newReport = new Report
            {
                Title = request.Title,
                Content = request.Content,
                //IsDeleted = request.IsDeleted,
                //IsSecond = request.IsSecond,
                CreatedAt = DateTime.UtcNow,
                StudentId = request.StudentId,
                //ReportStatusId = request.ReportStatusId,
                TestId = request.TestId
            };

            _reportService.AddReport(newReport);

            var response = new ReportResponse
            {
                Id = newReport.Id,
                Title = newReport.Title,
                Content = newReport.Content,
                //IsDeleted = newReport.IsDeleted,
                //IsSecond = newReport.IsSecond,
                CreatedAt = newReport.CreatedAt,
                StudentId = newReport.StudentId,
                //ReportStatusId = newReport.ReportStatusId,
                TestId = newReport.TestId
            };

            return CreatedAtAction("GetReportById", new { id = response.Id }, response);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateReport(int id, [FromBody] ReportRequest request)
        {
            var existingReport = _reportService.GetReportById(id);
            if (existingReport == null)
            {
                return NotFound($"Report with ID {id} not found.");
            }

            existingReport.Title = request.Title;
            existingReport.Content = request.Content;
            //existingReport.IsDeleted = request.IsDeleted;
            //existingReport.IsSecond = request.IsSecond;
            existingReport.StudentId = request.StudentId;
            //existingReport.ReportStatusId = request.ReportStatusId;
            existingReport.TestId = request.TestId;

            _reportService.UpdateReport(existingReport);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteReport(int id)
        {
            var existingReport = _reportService.GetReportById(id);
            if (existingReport == null)
            {
                return NotFound($"Report with ID {id} not found.");
            }
            _reportService.DeleteReport(id);
            return NoContent();
        }
    }
}
