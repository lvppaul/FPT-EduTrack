using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportFeedbackController : ControllerBase
    {
        private readonly IReportFeedbackService _reportFeedbackService;

        public ReportFeedbackController(IReportFeedbackService reportFeedbackService)
        {
            _reportFeedbackService = reportFeedbackService;
        }

        [HttpGet]
        public async Task<ActionResult<ReportFeedbackResponse>> GetAllReportFeedbacks([FromQuery] Pagination pagination)
        {
            var listFeedback = await _reportFeedbackService.GetAllAsync(pagination);
            if(listFeedback == null || !listFeedback.Any())
            {
                return NotFound(new
                {
                    success = false,
                    message = "No feedbacks found."
                });
            }
            return Ok(new
            {
                success = true,
                data = listFeedback,
                count = listFeedback.Count()
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportFeedbackResponse>> GetReportFeedbackById(int id, [FromQuery] Pagination pagination)
        {
            var feedback = await _reportFeedbackService.GetByIdAsync(id);
            if(feedback == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "No feedback found"
                });
            }
            return Ok(new
            {
                success = true,
                data = feedback,
                count = 1
            });
        }

        [HttpPost]
        public async Task<ActionResult<ReportFeedbackResponse>> AddReportFeedback([FromBody] ReportFeedbackRequest request)
        {
            var feedback = await _reportFeedbackService.AddAsync(request);
            if(feedback == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Failed to create feedback."
                });
            }
            return CreatedAtAction(nameof(GetReportFeedbackById), new { id = feedback.Id }, feedback);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ReportFeedbackResponse>> UpdateReportFeedback(int id, [FromBody] ReportFeedbackUpdate request)
        {
            var existingFeedback = await _reportFeedbackService.GetByIdAsync(id);
            if(existingFeedback == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Feedback not existed"
                });
            }

            var updateFeedback = await _reportFeedbackService.UpdateAsync(id, request);
            if(updateFeedback == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cannot update feedback"
                });
            }
            return Ok(updateFeedback);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReportFeedback(int id)
        {
            var existingFeedback = await _reportFeedbackService.GetByIdAsync(id);
            if (existingFeedback == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Feedback not existed"
                });
            }
            await _reportFeedbackService.DeleteAsync(id);
            return Ok(new
            {
                success = true,
                message = "Delete feedback successfully"
            });
        }
    }
}
