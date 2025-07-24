using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class GradingAIService : IGradingAIService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GradingAIService> _logger;
        private readonly IParseResponse _parseService;
        private readonly IConfiguration _configuration;
        //private readonly string _url = "http://langflow2025.gtcbaqfsdwfaf6ep.eastasia.azurecontainer.io:7860/api/v1/run/9ae28e62-f044-4d78-b81d-969989442b0b";

        public GradingAIService(HttpClient httpClient, ILogger<GradingAIService> logger, IParseResponse parseService, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _parseService = parseService;
            _configuration = configuration;
        }

        public async Task<GradingAIResponse> ProcessGradingAsync(GradingFileRequest request)
        {
            try
            {
                List<string> uploadedGuidelineFileNames = new List<string>();
                List<string> uploadedTestFileNames = new List<string>();
                string? gradingGuide = null;
                string? studentEssays = null;

                // Upload file nếu có và xử lý encoding cho GuidelineFiles
                if (request.GuidelineFiles != null && request.GuidelineFiles.Any())
                {
                    foreach (var file in request.GuidelineFiles)
                    {
                        // Validation
                        var validExtensions = new List<string> { ".txt", ".docx", ".pdf" };
                        string extension = Path.GetExtension(file.FileName ?? "").ToLower();

                        if (!validExtensions.Contains(extension))
                        {
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "File extension is not valid" }
                            };
                        }

                        // File size validation (5MB)
                        if (file.Length > (5 * 1024 * 1024))
                        {
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "Maximum size can be 5MB" }
                            };
                        }

                        string filename = Guid.NewGuid().ToString() + extension;
                        uploadedGuidelineFileNames.Add(filename);
                        gradingGuide = await _parseService.ReadFileAsync(file);
                        if (string.IsNullOrWhiteSpace(gradingGuide))
                        {
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "Error reading guideline file" }
                            };
                        }
                    }
                }

                // Upload file nếu có và xử lý encoding cho TestFiles
                if (request.TestFiles != null && request.TestFiles.Any())
                {
                    foreach (var file in request.TestFiles)
                    {
                        // Validation
                        var validExtensions = new List<string> { ".txt", ".docx", ".pdf" };
                        string extension = Path.GetExtension(file.FileName ?? "").ToLower();

                        if (!validExtensions.Contains(extension))
                        {
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "File extension is not valid" }
                            };
                        }

                        // File size validation (5MB)
                        if (file.Length > (5 * 1024 * 1024))
                        {
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "Maximum size can be 5MB" }
                            };
                        }

                        string filename = Guid.NewGuid().ToString() + extension;
                        uploadedTestFileNames.Add(filename);
                        studentEssays = await _parseService.ReadFileAsync(file);

                        // Debug logging
                        _logger.LogInformation($"Read test file: {file.FileName}, Size: {file.Length}, Content length: {studentEssays?.Length ?? 0}");
                        if (string.IsNullOrWhiteSpace(studentEssays))
                        {
                            _logger.LogWarning($"Student essay content is empty for file: {file.FileName}");
                            return new GradingAIResponse
                            {
                                Success = false,
                                Grading = new GradingResponse { Justification = "Error reading test file" }
                            };
                        }
                    }
                }

                // Debug logging để kiểm tra nội dung
                _logger.LogInformation($"Final studentEssays content: {studentEssays?.Substring(0, Math.Min(studentEssays.Length, 100)) ?? "NULL/EMPTY"}...");
                _logger.LogInformation($"Final gradingGuide content: {gradingGuide?.Substring(0, Math.Min(gradingGuide.Length, 100)) ?? "NULL/EMPTY"}...");

                // Validation: Đảm bảo có student essay để chấm
                if (string.IsNullOrWhiteSpace(studentEssays))
                {
                    return new GradingAIResponse
                    {
                        Success = false,
                        Grading = new GradingResponse { Justification = "No student essay content found. Please upload a valid essay file." }
                    };
                }

                // Tạo payload theo đúng structure của flow
                var payload = new
                {
                    output_type = "text",
                    input_type = "text",
                    tweaks = new
                    {
                        // Text Input cho grading description
                        TextInputUwzlE = new Dictionary<string, object>
                        {
                            ["input_value"] = gradingGuide ?? ""
                        },

                        // Text Input cho IELTS questions
                        TextInputVA8YW = new Dictionary<string, object>
                        {
                            ["input_value"] = request.TextInputValue ?? "Please evaluate this essay according to the four criteria: Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Provide a detailed analysis and suggest a band score for each criterion, followed by an overall score (0–9)."
                        },

                        // Text Input cho student essay
                        TextInputVU0oa = new Dictionary<string, object>
                        {
                            ["input_value"] = studentEssays ?? ""
                        },

                        // Prompt template
                        PromptNMxLe = new Dictionary<string, object>
                        {
                            ["template"] = "You are an IELTS examiner. Evaluate the following Task 2 writing based on IELTS band descriptors and document.\nDocument:\n{docs}\nCriteria:\n- Task Response\n- Coherence and Cohesion\n- Lexical Resource\n- Grammatical Range and Accuracy\n\nGive a detailed analysis and suggest a band score for each criterion, followed by an overall score (0–9).\nQuestions:\n{questions}"
                        },

                        // OpenRouter AI model
                        OpenRouterComponentPwNfE = new Dictionary<string, object>
                        {
                            ["model_name"] = "deepseek/deepseek-r1-0528:free",
                            ["temperature"] = 0.7,
                            ["max_tokens"] = 4000
                        },

                        // Text Output component
                        TextOutputG4vmg = new Dictionary<string, object>
                        {
                            ["input_value"] = ""
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

                var _url = _configuration["LangflowURL"];
                var response = await _httpClient.PostAsync(_url, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var gradingResponse = _parseService.ParseLangflowResponse(responseContent);
                    if (gradingResponse == null)
                    {
                        return new GradingAIResponse
                        {
                            Success = false,
                            Grading = new GradingResponse { Justification = $"Parsing Response failed" }
                        };
                    }
                    else
                    {
                        return new GradingAIResponse
                        {
                            Success = true,
                            Grading = gradingResponse,
                            GuidelineFilesProcessed = uploadedGuidelineFileNames.Count,
                            GuidelineUploadedFiles = uploadedGuidelineFileNames,
                            OriginalGuidelineFileNames = request.GuidelineFiles?.Select(f => f.FileName).ToArray() ?? new string[0],
                            TestFilesProcessed = uploadedTestFileNames.Count,
                            TestUploadedFiles = uploadedTestFileNames,
                            OriginalTestFileNames = request.TestFiles?.Select(f => f.FileName).ToArray() ?? new string[0]
                        };
                    }
                }
                else
                {
                    var errorBytes = await response.Content.ReadAsByteArrayAsync();
                    var errorContent = Encoding.UTF8.GetString(errorBytes);
                    _logger.LogError($"API Error: {response.StatusCode} - {errorContent}");

                    return new GradingAIResponse
                    {
                        Success = false,
                        Grading = new GradingResponse { Justification = $"API request failed: {errorContent}" }
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing grading request");
                return new GradingAIResponse
                {
                    Success = false,
                    Grading = new GradingResponse { Justification = $"An error occurred: {ex.Message}" }
                };
            }
        }
    }
}
