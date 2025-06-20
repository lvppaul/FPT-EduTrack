using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Authorization;
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
        //[Authorize]
        public async Task<ActionResult<List<ReportResponse>>> GetAllReports()
        {
            var reports = await _reportService.GetAllAsync();
            if (reports == null || !reports.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No reports found."
                });
            }
            return Ok(reports);
        }

        [HttpGet("id")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetReportByID(int id)
        {
            var report = await _reportService.GetByIdAsync(id);
            if (report == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Report with ID {id} not found."
                });
            }
            return Ok(report);
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> CreateReport([FromBody] ReportRequest request)
        {
            var newReport = await _reportService.CreateAsync(request);
            if(newReport == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create report."
                });
            }
            return CreatedAtAction(nameof(GetReportByID), new { id = newReport.Id }, newReport);
        }

        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> UpdateReport(int id, [FromBody] ReportUpdate request)
        {
            var existingReport = await _reportService.GetByIdAsync(id);
            if (existingReport == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Report with ID {id} not found."
                });
            }
            var updatedReport = await _reportService.EditAsync(id, request);
            if (updatedReport == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to update report."
                });
            }
            return Ok(updatedReport);
        }

        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var existingReport = await _reportService.GetByIdAsync(id);
            if (existingReport == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Report with ID {id} not found."
                });
            }
            await _reportService.DeleteAsync(id);
            return NoContent();
        }
    }
}
