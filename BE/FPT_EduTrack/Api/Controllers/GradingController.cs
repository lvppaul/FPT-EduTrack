using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

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

        /*  [HttpPost("process")]
          public async Task<IActionResult> ProcessFlow(GradingRequest request)
          {
              try
              {
                  var url = "http://127.0.0.1:7860/api/v1/run/17764c10-9318-4b75-9723-75b3a2151642";

                  var payload = new
                  {
                      input_value = request.InputValue ?? string.Empty,
                      output_type = "chat",
                      input_type = "chat",
                      tweaks = new
                      {
                          ChatInputFcfmk = new
                          {
                              files = request.Files ?? new string[] { }
                          },
                          TextInputR5mPI = new
                          {
                              input_value = request.TextInputValue ?? string.Empty
                          }
                      }
                  };

                  var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
                  {
                      PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                  });
                  var content = new StringContent(json, Encoding.UTF8, "application/json");

                  _httpClient.DefaultRequestHeaders.Clear();

                  var response = await _httpClient.PostAsync(url, content);

                  if (response.IsSuccessStatusCode)
                  {
                      var responseContent = await response.Content.ReadAsStringAsync();
                      return Ok(new
                      {
                          success = true,
                          data = responseContent
                      });
                  }
                  else
                  {
                      _logger.LogError($"API request failed with status: {response.StatusCode}");
                      return StatusCode((int)response.StatusCode, new
                      {
                          error = "API request failed",
                          statusCode = response.StatusCode
                      });
                  }
              }
              catch (HttpRequestException ex)
              {
                  _logger.LogError(ex, "Error making API request");
                  return StatusCode(500, new { error = "Error making API request", details = ex.Message });
              }
              catch (JsonException ex)
              {
                  _logger.LogError(ex, "Error parsing response");
                  return StatusCode(500, new { error = "Error parsing response", details = ex.Message });
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Unexpected error occurred");
                  return StatusCode(500, new { error = "An unexpected error occurred", details = ex.Message });
              }
          }*/

        /*  [HttpPost("upload-and-process")]
          [Consumes("multipart/form-data")]
          public async Task<IActionResult> UploadAndProcess(GradingFileRequest request)
          {
              try
              {
                  var url = "http://127.0.0.1:7860/api/v1/run/17764c10-9318-4b75-9723-75b3a2151642";

                  var processedFiles = new List<object>();

                  if (request.Files != null && request.Files.Any())
                  {
                      foreach (var file in request.Files)
                      {
                          // Đọc nội dung file
                          using var memoryStream = new MemoryStream();
                          await file.CopyToAsync(memoryStream);
                          var fileBytes = memoryStream.ToArray();
                          var base64String = Convert.ToBase64String(fileBytes);

                          // Tạo object chứa thông tin file
                          var fileData = new
                          {
                              filename = file.FileName,
                              content = base64String,
                              contentType = file.ContentType,
                              size = file.Length
                          };

                          processedFiles.Add(fileData);
                      }
                  }

                  var payload = new
                  {
                      input_value = request.InputValue ?? "hello world!",
                      output_type = "chat",
                      input_type = "chat",
                      tweaks = new
                      {
                          ChatInputFcfmk = new
                          {
                              files = processedFiles.ToArray()
                          },
                          TextInputR5mPI = new
                          {
                              input_value = request.TextInputValue ?? string.Empty
                          }
                      }
                  };

                  var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
                  {
                      PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                  });
                  var content = new StringContent(json, Encoding.UTF8, "application/json");

                  var response = await _httpClient.PostAsync(url, content);

                  if (response.IsSuccessStatusCode)
                  {
                      var responseContent = await response.Content.ReadAsStringAsync();
                      return Ok(new
                      {
                          success = true,
                          data = responseContent,
                          filesProcessed = processedFiles.Count,
                          fileNames = processedFiles.Select(f => ((dynamic)f).filename).ToArray()
                      });
                  }
                  else
                  {
                      return StatusCode((int)response.StatusCode, new { error = "API request failed" });
                  }
              }
              catch (Exception ex)
              {
                  _logger.LogError(ex, "Error processing upload request");
                  return StatusCode(500, new { error = "An error occurred while processing your request" });
              }
          }*/

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
