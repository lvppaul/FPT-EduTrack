using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IAiService _service;

        public AiController(IAiService service)
        {
            _service = service;
        }

        [HttpPost("read-file")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ReadContentFromFile([FromForm] FileUploadRequest fileInput)
        {
            var file = fileInput.File;
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid file input"
                });
            }
            //Check file extension
            var allowExtensions = new[] { ".doc", ".docx" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if(!allowExtensions.Contains(extension))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Please upload file .doc or .docx"
                });
            }
            //Check MIME type
            var allowMimeTypes = new[]
            {
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            };
            if(!allowMimeTypes.Contains(file.ContentType))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid file type"
                });
            }

            var content = await _service.ReadFileAsync(file);

            return Ok(content);
        }
    }
}
