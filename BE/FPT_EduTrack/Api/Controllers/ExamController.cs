using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;
        public ExamController(IExamService examService)
        {
            _examService = examService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var exams = await _examService.GetAllAsync();
                if (exams == null || !exams.Any())
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "No exams found."
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Exams retrieved successfully",
                    data = exams,
                    count = exams.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving exam",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var exam = await _examService.GetExamByIdAsync(id);
                if (exam == null)
                    return NotFound(new
                    {
                        success = false,
                        message = $"Exam with ID {id} not found."
                    });

                return Ok(new
                {
                    success = true,
                    message = "Exam retrieved successfully",
                    data = exam,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving exam {id}",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExamRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid exam request data."
                });
            }

            var createdExam = await _examService.CreateAsync(request);

            if (createdExam == null)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating the exam."
                });
            }

            return CreatedAtAction(nameof(GetById), new { id = createdExam.Id }, new
            {
                success = true,
                message = "Exam created successfully",
                data = createdExam
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ExamRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid exam data."
                });
            }

            var existingExam = await _examService.GetExamByIdAsync(id);
            if (existingExam == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Exam with ID {id} not found."
                });
            }

            var updatedExam = await _examService.UpdateExamAsync(id, request);
            if (updatedExam == null)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update exam."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Exam updated successfully.",
                data = updatedExam
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _examService.DeleteAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Exam with ID {id} not found."
                });
            }

            return NoContent();
        }
    }
}
