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

        [HttpGet("pagination")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetAllReports([FromQuery] Pagination pagination)
        {
            var listReportPagination = await _reportService.GetAllPaginationAsync(pagination);
            if (listReportPagination == null || !listReportPagination.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No reports found."
                });
            }

            var listReport = await _reportService.GetAllAsync();

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = listReport.Count()
            });
        }



        [HttpGet("{id}")]
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
            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = report,
                count = 1
            });
        }

        [HttpGet("student-reports/{studentId}")]
        public async Task<ActionResult<ReportResponse>> GetReportByStudentId(int studentId, [FromQuery] Pagination pagination)
        {
            var listReportPagination = await _reportService.GetReportByStudentIdPaginationAsync(studentId, pagination);
            if(listReportPagination == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Student hasn't create any report"
                });
            }

            var listReport = await _reportService.GetReportByStudentIdAsync(studentId);

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = listReport.Count()
            });
        }

        [HttpGet("report/{statusId}")]
        public async Task<ActionResult<ReportResponse>> GetReportByStatusPaginationAsync(int statusId, [FromQuery] Pagination pagination)
        {
            var listReportPagination = await _reportService.GetReportByStatusPaginationAsync(statusId, pagination);
            if (listReportPagination == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"No report of status"
                });
            }
            var listReport = await _reportService.GetReportByStatusAsync(statusId);

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = listReport.Count()
            });
        }

        [HttpPost("student-report-exam")]
        public async Task<ActionResult<ReportResponse>> GetStudentReportExam([FromBody] GetReportInExam reportForm, [FromQuery]Pagination pagination)
        {
            var listReportPagination = await _reportService.GetReportByStudentAndTestPaginationAsync(reportForm.StudentId, reportForm.TestId, pagination);
            if (listReportPagination == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"No report found!"
                });
            }

            var listReport = await _reportService.GetReportByStudentAndTestAsync(reportForm.StudentId, reportForm.TestId);

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = 1
            });
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
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetAllReports()
        {
            var listReportPagination = await _reportService.GetAllAsync();
            if (listReportPagination == null || !listReportPagination.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No reports found."
                });
            }

            var listReport = await _reportService.GetAllAsync();

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = listReport.Count()
            });
        }

        [HttpGet("lecturer/{lecturerId}")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetReportToReGradingAsync(int lecturerId)
        {
            var report = await _reportService.GetReportToReGradingAsync(lecturerId);
            if (report == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Reports with LecturerID {lecturerId} not found."
                });
            }
            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = report,
                count = 1
            });
        }

        [HttpGet("to-confirmed")]
        //[Authorize]
        public async Task<ActionResult<ReportResponse>> GetReportToConfrimedAsync()
        {
            var report = await _reportService.GetReportToConfirmedAsync();
            if (report == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"no data."
                });
            }
            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = report,
                count = 1
            });
        }

        [HttpPut("to-confirmed/{id}")]
        //[Authorize]
        public async Task<IActionResult> UpdateReportStatusToConfirm(int id)
        {
          

            var existingReport = await _reportService.UpdateReportStatusToConfirm(id);
            if (existingReport<=0)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Confirm report with ID {id} failed."
                });
            }


            return Ok(new
            {
                success = true,
                message = "Confirm successfully.",
            });
        }
        [HttpPut("to-rejected/{id}")]
        //[Authorize]
        public async Task<IActionResult> UpdateReportStatusToReject(int id)
        {


            var existingReport = await _reportService.UpdateReportStatusToReject(id);
            if (existingReport <= 0)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Reject report with ID {id} failed."
                });
            }


            return Ok(new
            {
                success = true,
                message = "Reject successfully.",
            });
        }
        [HttpPut("to-grading/{id}")]
        //[Authorize]
        public async Task<IActionResult> UpdateReportStatusToGrading(int id)
        {


            var existingReport = await _reportService.UpdateReportStatusToGrading(id);
            if (existingReport <= 0)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Grading report with ID {id} failed."
                });
            }


            return Ok(new
            {
                success = true,
                message = "Grading successfully.",
            });
        }


        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetReportByStudent(int studentId)
        {
            var listReportPagination = await _reportService.GetReportByStudentAsync(studentId);
            if (listReportPagination == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Student hasn't create any report"
                });
            }

            var listReport = await _reportService.GetReportByStudentAsync(studentId);

            return Ok(new
            {
                success = true,
                message = "Reports retrieved successfully.",
                data = listReportPagination,
                count = listReport.Count()
            });
        }
    }
}
