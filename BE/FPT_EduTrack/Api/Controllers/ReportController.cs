using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
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
        private readonly IUserService _userService;
        private readonly ITestService _testService;
        public ReportController(IReportService reportService, IUserService userService, ITestService testService)
        {
            _reportService = reportService;
            _userService = userService;
            _testService = testService;
        }

        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetAllReports([FromQuery] Pagination pagination)
        {
            var listReport = await _reportService.GetAllAsync(pagination);
            if (listReport == null || !listReport.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No reports found."
                });
            }

            var response = new ReportResponse
            {

                Success = true,
                Message = "Reports retrieved successfully.",
                Data = listReport,
                Count = listReport.Count()
            };
            return Ok(response);
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
            var response = new ReportResponse
            {

                Success = true,
                Message = "Reports retrieved successfully.",
                Data = new List<ReportDataResponse> { report },
                Count = 1
            };
            return Ok(response);
        }

        [HttpGet("student-reports/{studentId}")]
        public async Task<ActionResult<ReportResponse>> GetReportByStudentId(int studentId, [FromQuery] Pagination pagination)
        {
            var listReport = await _reportService.GetReportByStudentId(studentId, pagination);
            if(listReport == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Student hasn't create any report"
                });
            }
            var response = new ReportResponse
            {
                Success = true,
                Message = "Reports retrieved successfully.",
                Data = listReport,
                Count = listReport.Count()
            };
            return Ok(response);
        }

        [HttpPost("student-report-exam")]
        public async Task<ActionResult<ReportResponse>> GetStudentReportExam([FromBody] GetReportInExam reportForm)
        {
            var report = await _reportService.GetReportByStudentAndTest(reportForm.StudentId, reportForm.TestId);
            if (report == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"No report found!"
                });
            }
            var response = new ReportResponse
            {

                Success = true,
                Message = "Reports retrieved successfully.",
                Data = new List<ReportDataResponse> { report },
                Count = 1
            };
            return Ok(response);
        }

        [HttpPost]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> CreateReport([FromBody] ReportRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState
                    .Where(ms => ms.Value.Errors.Any())
                    .Select(ms => new
                    {
                        Field = ms.Key,
                        Errors = ms.Value.Errors.Select(e => e.ErrorMessage).ToList()
                    });

                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors = errorMessages
                });
            }

            var student = await _userService.GetByIdAsync(request.StudentId);
            if (student == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "StudentId does not exist."
                });
            }

            var test = await _testService.GetTestByIdAsync(request.TestId);
            if (test == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "TestId does not exist."
                });
            }

            var report = await _reportService.CreateAsync(request);
            if (report == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create report."
                });
            }

            return CreatedAtAction(nameof(GetReportByID), new { id = report.Id }, report);
        }

        [HttpPut("{id}")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> UpdateReport(int id, [FromBody] ReportUpdate request)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState
                    .Where(ms => ms.Value.Errors.Any())
                    .Select(ms => new
                    {
                        Field = ms.Key,
                        Errors = ms.Value.Errors.Select(e => e.ErrorMessage).ToList()
                    });

                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed.",
                    errors = errorMessages
                });
            }

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

            return Ok(new
            {
                success = true,
                message = "Report updated successfully.",
                data = updatedReport
            });
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
            return Ok(new
            {
                success = true,
                message = "Report deleted successfully."
            });
        }
    }
}
