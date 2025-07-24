using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradingController : ControllerBase
    {
        private readonly IGradingAIService _gradingAIService;

        public GradingController(IGradingAIService gradingAIService)
        {
            _gradingAIService = gradingAIService;
        }

        [HttpPost("upload-and-process")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAndProcess([FromForm] GradingFileRequest request)
        {
            var result = await _gradingAIService.ProcessGradingAsync(request);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }



    }
}
