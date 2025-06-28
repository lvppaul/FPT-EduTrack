using FPT_EduTrack.BusinessLayer.DTOs.Request;
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
        private readonly HttpClient _httpClient;
        private readonly ILogger<GradingController> _logger;
        private readonly IParseResponse _service;


        public GradingController(HttpClient httpClient, ILogger<GradingController> logger, IParseResponse service)
        {
            _httpClient = httpClient;
            _logger = logger;
            _service = service;
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
            try
            {
                List<string> uploadedGuidelineFileNames = new List<string>();
                List<string> uploadedTestFileNames = new List<string>();

                // Upload file nếu có và xử lý encoding cho GuidelineFiles
                if (request.GuidelineFiles != null && request.GuidelineFiles.Any())
                {
                    foreach (var file in request.GuidelineFiles)
                    {
                        // Validation
                        var validExtensions = new List<string> { ".txt", ".docx", ".pdf" };
                        //Ví dụ: "document.pdf"     -> ".pdf"
                        string extension = Path.GetExtension(file.FileName ?? "").ToLower();

                        if (!validExtensions.Contains(extension))
                        {
                            return BadRequest(new { message = "File extension is not valid", validExtensions });
                        }

                        // File size validation (5MB)
                        // 5* 1024 (KB) còn 5 *1024 *1024 (MB)
                        if (file.Length > (5 * 1024 * 1024))
                        {
                            return BadRequest(new { message = "Maximum size can be 5MB" });
                        }

                        string filename = Guid.NewGuid().ToString() + extension;
                        uploadedGuidelineFileNames.Add(filename);
                    }
                }

                // Upload file nếu có và xử lý encoding cho TestFiles
                if (request.TestFiles != null && request.TestFiles.Any())
                {
                    foreach (var file in request.TestFiles)
                    {
                        // Validation
                        var validExtensions = new List<string> { ".txt", ".docx", ".pdf" };
                        //Ví dụ: "document.pdf"     -> ".pdf"
                        string extension = Path.GetExtension(file.FileName ?? "").ToLower();

                        if (!validExtensions.Contains(extension))
                        {
                            return BadRequest(new { message = "File extension is not valid", validExtensions });
                        }

                        // File size validation (5MB)
                        // 5* 1024 (KB) còn 5 *1024 *1024 (MB)
                        if (file.Length > (5 * 1024 * 1024))
                        {
                            return BadRequest(new { message = "Maximum size can be 5MB" });
                        }

                        string filename = Guid.NewGuid().ToString() + extension;
                        uploadedTestFileNames.Add(filename);
                    }
                }

                var url = "http://127.0.0.1:7860/api/v1/run/17764c10-9318-4b75-9723-75b3a2151642";

                // Tạo payload theo đúng structure của flow
                var payload = new
                {
                    //input_value =  "Grade this essay",
                    output_type = "text", // Thay đổi từ "chat" thành "text"
                    input_type = "text",  // Thay đổi từ "chat" thành "text"
                    tweaks = new
                    {
                        // File component cho IELTS band descriptors (File-a1Ewg)
                        FileA1Ewg = new Dictionary<string, object>
                        {
                            ["path"] = uploadedGuidelineFileNames.Any() ? uploadedGuidelineFileNames.ToArray() : new string[0]
                        },

                        // Parser cho band descriptors (ParserComponent-EOIat)
                        ParserComponentEOIat = new Dictionary<string, object>
                        {
                            ["mode"] = "Parser",
                            ["pattern"] = "Guidelines: {text}"
                        },

                        // Text Input cho IELTS questions (TextInput-R5mPI)
                        TextInputR5mPI = new Dictionary<string, object>
                        {
                            ["input_value"] = request.TextInputValue ?? "Please evaluate this essay according to the four criteria: Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Provide a detailed analysis and suggest a band score for each criterion, followed by an overall score (0–9)."
                        },

                        // File component cho student essay (File-5h6bu)
                        File5h6bu = new Dictionary<string, object>
                        {
                            ["path"] = uploadedTestFileNames.Any() ? uploadedTestFileNames.ToArray() : new[] { "student-essay.docx" }
                        },

                        // Parser cho student essay (ParserComponent-Xu457)
                        ParserComponentXu457 = new Dictionary<string, object>
                        {
                            ["mode"] = "Parser",
                            ["pattern"] = "Student Test: {text}"
                        },

                        // Prompt template (Prompt-dMGrl)
                        //PromptDMGrl = new Dictionary<string, object>
                        //{
                        //    ["template"] = "You are an IELTS examiner. Evaluate the following Task 2 writing based on IELTS band descriptors and document.\nDocument:\n{docs}\nCriteria:\n- Task Response\n- Coherence and Cohesion\n- Lexical Resource\n- Grammatical Range and Accuracy\n\nGive a detailed analysis and suggest a band score for each criterion, followed by an overall score (0–9).\nQuestions:\n{questions}"
                        //},

                        // OpenRouter AI model (OpenRouterComponent-v1VHI)
                        //OpenRouterComponentV1VHI = new Dictionary<string, object>
                        //{
                        //    ["model_name"] = "deepseek/deepseek-r1-0528:free",
                        //    ["temperature"] = 0.7,
                        //    ["max_tokens"] = 4000
                        //},

                        // Text Output component (TextOutput-3ha4Y)
                        TextOutput3ha4Y = new Dictionary<string, object>
                        {
                            ["input_value"] = "" // Sẽ được fill bởi OpenRouter output
                        }
                    }
                };


                // Serialize với UTF-8 encoding explicit
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                    WriteIndented = true
                };

                var json = JsonSerializer.Serialize(payload, options);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Clear headers và set proper encoding
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    // Đọc response với UTF-8 encoding
                    var responseBytes = await response.Content.ReadAsByteArrayAsync();
                    var responseContent = Encoding.UTF8.GetString(responseBytes);
                    //var parsedResponse = _service.ParseLangflowResponse(responseContent);
                    var cleanedContent = _service.ParseLangflowResponse(responseContent);
                    return Ok(new
                    {
                        success = true,
                        grading = cleanedContent,
                        guidelineFilesProcessed = uploadedGuidelineFileNames.Count,
                        guidelineUploadedFiles = uploadedGuidelineFileNames,
                        originalGuidelineFileNames = request.GuidelineFiles?.Select(f => f.FileName).ToArray() ?? new string[0],
                        testFilesProcessed = uploadedTestFileNames.Count,
                        testUploadedFiles = uploadedTestFileNames,
                        originalTestFileNames = request.TestFiles?.Select(f => f.FileName).ToArray() ?? new string[0]
                    });
                }
                else
                {
                    var errorBytes = await response.Content.ReadAsByteArrayAsync();
                    var errorContent = Encoding.UTF8.GetString(errorBytes);
                    _logger.LogError($"API Error: {response.StatusCode} - {errorContent}");
                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "API request failed",
                        details = errorContent,
                        statusCode = response.StatusCode
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing upload request");
                return StatusCode(500, new
                {
                    error = "An error occurred while processing your request",
                    details = ex.Message
                });
            }
        }



    }
}
