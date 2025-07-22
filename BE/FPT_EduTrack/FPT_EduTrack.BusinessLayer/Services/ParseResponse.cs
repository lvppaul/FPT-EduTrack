using Aspose.Words;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class ParseResponse : IParseResponse
    {
        /* public GradingResponse? ParseLangflowResponse(string rawResponse)
         {
             try
             {
                 using var document = JsonDocument.Parse(rawResponse);
                 var root = document.RootElement;

                 // Kiểm tra structure mới của response
                 if (!root.TryGetProperty("outputs", out var outputs) ||
                     outputs.GetArrayLength() == 0)
                 {
                     return null;
                 }

                 var firstOutput = outputs[0];
                 if (!firstOutput.TryGetProperty("outputs", out var nestedOutputs) ||
                     nestedOutputs.GetArrayLength() == 0)
                 {
                     return null;
                 }

                 var result = nestedOutputs[0];

                 // Thử lấy text từ artifacts trước
                 string fullText = "";
                 if (result.TryGetProperty("artifacts", out var artifacts) &&
                     artifacts.TryGetProperty("message", out var artifactMessage))
                 {
                     fullText = artifactMessage.GetString() ?? "";
                 }
                 // Nếu không có artifacts, thử lấy từ results.message.text
                 else if (result.TryGetProperty("results", out var results) &&
                          results.TryGetProperty("message", out var message) &&
                          message.TryGetProperty("text", out var textElement))
                 {
                     fullText = textElement.GetString() ?? "";
                 }
                 // Nếu không có cả hai, thử lấy từ outputs.message
                 else if (result.TryGetProperty("outputs", out var resultOutputs) &&
                          resultOutputs.TryGetProperty("message", out var outputMessage) &&
                          outputMessage.TryGetProperty("message", out var messageText))
                 {
                     fullText = messageText.GetString() ?? "";
                 }

                 if (string.IsNullOrEmpty(fullText))
                 {
                     return null;
                 }

                 // Parse IELTS grading từ text
                 var gradingResult = ParseIELTSGrading(fullText);

                 // Get metadata
                 var sessionId = root.TryGetProperty("session_id", out var sessionElement)
                     ? sessionElement.GetString() : "";

                 // Tìm timestamp từ nhiều vị trí có thể
                 string timestamp = "";
                 if (result.TryGetProperty("results", out var resultsForTimestamp) &&
                     resultsForTimestamp.TryGetProperty("message", out var messageForTimestamp) &&
                     messageForTimestamp.TryGetProperty("timestamp", out var timestampElement))
                 {
                     timestamp = timestampElement.GetString() ?? "";
                 }
                 else if (result.TryGetProperty("artifacts", out var artifactsForTimestamp) &&
                          artifactsForTimestamp.TryGetProperty("timestamp", out var artifactTimestamp))
                 {
                     timestamp = artifactTimestamp.GetString() ?? "";
                 }

                 // Tìm source information
                 string source = "Unknown";
                 if (result.TryGetProperty("results", out var resultsForSource) &&
                     resultsForSource.TryGetProperty("message", out var messageForSource) &&
                     messageForSource.TryGetProperty("properties", out var props) &&
                     props.TryGetProperty("source", out var sourceInfo) &&
                     sourceInfo.TryGetProperty("source", out var sourceModel))
                 {
                     source = sourceModel.GetString() ?? "Unknown";
                 }

                 return new GradingResponse
                 {
                     SessionId = sessionId,
                     Timestamp = timestamp,
                     OverallBand = gradingResult.OverallBand,
                     Criteria = gradingResult.Criteria,
                     Justification = gradingResult.Justification,
                     FullEvaluation = fullText,
                     Source = source
                 };
             }
             catch (Exception ex)
             {
                 // Log the actual error for debugging
                 Console.WriteLine($"Error parsing response: {ex.Message}");
                 Console.WriteLine($"Raw response: {rawResponse}");
                 return null;
             }
         }*/
        /* public GradingResponse? ParseLangflowResponse(string rawResponse)
         {
             try
             {
                 using var document = JsonDocument.Parse(rawResponse);
                 var root = document.RootElement;

                 if (!root.TryGetProperty("outputs", out var outputs) ||
                     outputs.GetArrayLength() == 0)
                 {
                     return null;
                 }

                 var firstOutput = outputs[0];
                 if (!firstOutput.TryGetProperty("outputs", out var nestedOutputs) ||
                     nestedOutputs.GetArrayLength() == 0)
                 {
                     return null;
                 }

                 var result = nestedOutputs[0];

                 // Lấy text từ results.text.text (structure mới)
                 string fullText = "";
                 if (result.TryGetProperty("results", out var results) &&
                     results.TryGetProperty("text", out var textObj) &&
                     textObj.TryGetProperty("data", out var dataObj) &&
                     dataObj.TryGetProperty("text", out var textElement))
                 {
                     fullText = textElement.GetString() ?? "";
                 }

                 if (string.IsNullOrEmpty(fullText))
                 {
                     return null;
                 }

                 // Clean up text - xử lý ký tự đặc biệt
                 fullText = CleanResponseText(fullText);

                 // Parse IELTS grading từ text
                 var gradingResult = ParseIELTSGrading(fullText);

                 // Get metadata
                 var sessionId = root.TryGetProperty("session_id", out var sessionElement)
                     ? sessionElement.GetString() : "";

                 var timestamp = "";
                 if (
                     results.TryGetProperty("text", out var textForTimestamp) &&
                     textForTimestamp.TryGetProperty("data", out var data) &&
                     data.TryGetProperty("timestamp", out var timestampElement))
                 {
                     timestamp = timestampElement.GetString() ?? "";
                 }

                 return new GradingResponse
                 {
                     SessionId = sessionId,
                     Timestamp = timestamp,
                     OverallBand = gradingResult.OverallBand,
                     Criteria = gradingResult.Criteria,
                     Justification = gradingResult.Justification,
                     FullEvaluation = fullText,
                     Source = "TextOutput-3ha4Y"
                 };
             }
             catch (Exception ex)
             {
                 Console.WriteLine($"Parse error: {ex.Message}");
                 return null;
             }
         }*/

        public GradingResponse? ParseLangflowResponse(string rawResponse)
        {
            try
            {
                using var document = JsonDocument.Parse(rawResponse);
                var root = document.RootElement;

                var sessionId = root.GetProperty("session_id").GetString();
                var outputs = root.GetProperty("outputs");
                var fullText = outputs[0].GetProperty("outputs")[0]
                    .GetProperty("results")
                    .GetProperty("text")
                    .GetProperty("data")
                    .GetProperty("text").GetString();

                var timestamp = outputs[0].GetProperty("outputs")[0]
                    .GetProperty("results")
                    .GetProperty("text")
                    .GetProperty("data")
                    .GetProperty("timestamp").GetString();

                // Try to extract JSON object from fullText if nested JSON exists
                var embeddedJsonMatch = Regex.Match(fullText ?? "", @"\{.*\}", RegexOptions.Singleline);
                if (!embeddedJsonMatch.Success) return null;

                var embeddedJson = embeddedJsonMatch.Value;

                //var criteria = JsonSerializer.Deserialize<Dictionary<string, Criterion>>(embeddedJson);
                var embeddedJsonDoc = JsonDocument.Parse(embeddedJson);
                var criteria = new Dictionary<string, Criterion>();
                double overallBand = 0;
                string? justification = null;

                foreach (var property in embeddedJsonDoc.RootElement.EnumerateObject())
                {
                    if (property.Value.ValueKind == JsonValueKind.Object &&
                        property.Value.TryGetProperty("Band", out _) &&
                        property.Value.TryGetProperty("Analysis", out _))
                    {
                        var criterion = JsonSerializer.Deserialize<Criterion>(property.Value.GetRawText());
                        if (criterion != null)
                        {
                            criteria[property.Name] = criterion;
                        }
                    }
                    else if (property.Name == "Overall Band" && property.Value.ValueKind == JsonValueKind.Number)
                    {
                        overallBand = property.Value.GetDouble();
                    }
                    else if (property.Name == "Overall Feedback" && property.Value.ValueKind == JsonValueKind.String)
                    {
                        justification = property.Value.GetString();
                    }
                }




                /*  if (criteria != null && criteria.TryGetValue("Overall Band", out var overallEval))
                  {
                      overallBand = $"Band {overallEval.Band}";
                  }

                  if (criteria != null && criteria.TryGetValue("Overall Feedback", out var justificationEval))
                  {
                      justification = justificationEval.Analysis;
                  }*/

                return new GradingResponse
                {
                    SessionId = sessionId,
                    Timestamp = timestamp,
                    OverallBand = overallBand,
                    Criteria = criteria,
                    //     FullEvaluation = fullText ?? "",
                    Justification = justification ?? "",
                    Source = "TextOutput-3ha4Y"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Parse error: {ex.Message}");
                return null;
            }
        }

        //Read file
        public async Task<string> ReadFileAsync(IFormFile file)
        {
            try
            {
                string extension = Path.GetExtension(file.FileName ?? "").ToLower();
                
                // Nếu là file text thuần, đọc trực tiếp
                if (extension == ".txt")
                {
                    using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
                    return await reader.ReadToEndAsync();
                }
                
                // Nếu là file Word/PDF, dùng Aspose
                using var stream = file.OpenReadStream();
                var doc = new Document(stream);
                string content = doc.ToString(SaveFormat.Text);
                return content;
            }
            catch (Exception ex)
            {
                // Log error và thử fallback
                Console.WriteLine($"Error reading file {file.FileName}: {ex.Message}");
                
                // Fallback: đọc như text file
                try
                {
                    using var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8);
                    return await reader.ReadToEndAsync();
                }
                catch (Exception fallbackEx)
                {
                    Console.WriteLine($"Fallback also failed for {file.FileName}: {fallbackEx.Message}");
                    return $"Error reading file: {file.FileName}";
                }
            }
        }



        // Method để làm sạch text response
        private string CleanResponseText(string text)
        {
            if (string.IsNullOrEmpty(text))
                return "";

            // Xử lý các ký tự escape một cách toàn diện
            text = text.Replace("\\n", "\n")       // \n -> newline
                       .Replace("\\\"", "\"")      // \" -> quote
                       .Replace("\\\\", "\\")      // \\ -> \
                       .Replace("nn", "\n\n")     // nn -> double newline
                       .Replace("  n", "\n")       // "  n" -> newline
                       .Replace(" n", "\n")       // " n" -> newline
                       .Replace("\\t", "\t")       // \t -> tab
                       .Replace("\\r", "\r");      // \r -> carriage return

            // Xử lý các format markdown và HTML
            /*  text = text.Replace("&nbsp;", " ")     // HTML space
                         .Replace("&quot;", "\"")    // HTML quote
                         .Replace("&amp;", "&")      // HTML ampersand
                         .Replace("&lt;", "<")       // HTML less than
                         .Replace("&gt;", ">");      // HTML greater than*/

            // Normalize whitespace
            text = Regex.Replace(text, @"\s+", " ");         // thay thế tất cả khoảng trắng liên tiếp (dấu cách, tab, xuống dòng, v.v.) bằng một dấu cách duy nhất.
            text = Regex.Replace(text, @"\n\s*\n", "\n\n");  // Clean multiple newlines

            return text.Trim();
        }

        // Cập nhật method ParseIELTSGrading để handle format mới
        /* private GradingResult ParseIELTSGrading(string text)
         {
             var criteria = new Dictionary<string, Criterion>();
             var overallBand = "Unknown";
             var justification = "";

             try
             {
                 // Làm sạch text trước khi parse
                 text = text.Replace("\\n", "\n").Replace("\\\"", "\"");

                 // Extract Overall Band Score - multiple patterns
                 var overallPatterns = new[]
                 {
             @"Overall Band Score:\s*Band\s*(\d+(?:\.\d+)?)",
             @"Overall Band:\s*Band\s*(\d+(?:\.\d+)?)",
             @"\*\*Overall Band Score:\s*Band\s*(\d+(?:\.\d+)?)\*\*"
         };

                 foreach (var pattern in overallPatterns)
                 {
                     var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);
                     if (match.Success)
                     {
                         overallBand = $"Band {match.Groups[1].Value}";
                         break;
                     }
                 }

                 // Extract individual criteria - updated patterns
                 var criteriaPatterns = new Dictionary<string, string>
                 {
                     ["Task Response"] = @"\*\*1\.\s*Task Response[:\s]*Band\s*(\d+(?:\.\d+)?)\*\*(.*?)(?=\*\*2\.|$)",
                     ["Coherence and Cohesion"] = @"\*\*2\.\s*Coherence and Cohesion[:\s]*Band\s*(\d+(?:\.\d+)?)\*\*(.*?)(?=\*\*3\.|$)",
                     ["Lexical Resource"] = @"\*\*3\.\s*Lexical Resource[:\s]*Band\s*(\d+(?:\.\d+)?)\*\*(.*?)(?=\*\*4\.|$)",
                     ["Grammatical Range and Accuracy"] = @"\*\*4\.\s*Grammatical Range and Accuracy[:\s]*Band\s*(\d+(?:\.\d+)?)\*\*(.*?)(?=\*\*Overall|$)"
                 };

                 foreach (var pattern in criteriaPatterns)
                 {
                     var match = Regex.Match(text, pattern.Value, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                     if (match.Success)
                     {
                         var bandScore = $"Band {match.Groups[1].Value}";
                         var details = match.Groups[2].Value.Trim();

                         // Clean up details more thoroughly
                         details = Regex.Replace(details, @"\*\*", "");
                         details = Regex.Replace(details, @"\\n", "\n");
                         details = Regex.Replace(details, @"\s+", " ");
                         details = details.Trim();

                         criteria[pattern.Key] = new Criterion
                         {
                             Name = pattern.Key,
                             BandScore = bandScore,
                             Details = details,
                             KeyPoints = ExtractKeyPoints(details)
                         };
                     }
                 }

                 // Extract justification - multiple patterns
                 var justificationPatterns = new[]
                 {
             @"\*\*Justification for Overall Band \d+:\*\*(.*?)$",
             @"Justification for Overall Band \d+:(.*?)$",
             @"\*\*Justification:\*\*(.*?)$"
         };

                 foreach (var pattern in justificationPatterns)
                 {
                     var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                     if (match.Success)
                     {
                         justification = match.Groups[1].Value.Trim();
                         justification = Regex.Replace(justification, @"\\n", "\n");
                         justification = Regex.Replace(justification, @"\*\*", "");
                         break;
                     }
                 }

             }
             catch (Exception ex)
             {
                 Console.WriteLine($"Error parsing IELTS grading: {ex.Message}");
             }

             return new GradingResult
             {
                 OverallBand = overallBand,
                 Criteria = criteria,
                 Justification = justification
             };
         }*/

        private GradingResult ParseIELTSGrading(string text)
        {
            var criteria = new Dictionary<string, Criterion>();
            var overallBand = "Unknown";
            var justification = "";

            try
            {
                // Clean text first
                // text = CleanResponseText(text);

                // Extract Overall Band Score - updated pattern for new format
                var overallPatterns = new[]
                {
                    @"###\s*Overall Band:\s*(\d+)",                           // ### Overall Band: 8
                    @"\*\*Overall Band:\*\*\s*(\d+)",                        // **Overall Band:** 8
                    @"Overall Band Score:\s*(\d+)",                          // Overall Band Score: 8
                    @"Overall:\s*(\d+)",                                     // Overall: 8
                    @"Band\s*(\d+)\s*overall"  ,                             // Band 8 overall
                    @"Overall Band:\s*(\d+)"                                 // Overall Band: 8
                };

                foreach (var pattern in overallPatterns)
                {
                    var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);
                    if (match.Success)
                    {
                        overallBand = $"Band {match.Groups[1].Value}";
                        break;
                    }
                }

                // Extract criteria using new format
                ExtractCriteriaFromNewFormat(text, criteria);

                // Extract overall feedback
                justification = ExtractOverallFeedback(text);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing IELTS grading: {ex.Message}");
            }

            return new GradingResult
            {
                OverallBand = overallBand,
                Criteria = criteria,
                Justification = justification
            };
        }

        // Extract criteria from new format: ### Task Response (Band: 8)
        private void ExtractCriteriaFromNewFormat(string text, Dictionary<string, Criterion> criteria)
        {
            // Debug logging
            Console.WriteLine("DEBUG: ExtractCriteriaFromNewFormat - Input text length: " + text.Length);
            Console.WriteLine("DEBUG: First 500 chars: " + text.Substring(0, Math.Min(500, text.Length)));

            var criteriaPatterns = new Dictionary<string, string>
            {
                ["Task Response"] = @"###\s*Task Response\s*\(Band:\s*(\d+)\)\s*(.*?)(?=###\s*Coherence|###\s*Lexical|###\s*Grammatical|###\s*Overall|\s*---\s*|$)",
                ["Coherence and Cohesion"] = @"###\s*Coherence and Cohesion\s*\(Band:\s*(\d+)\)\s*(.*?)(?=###\s*Task|###\s*Lexical|###\s*Grammatical|###\s*Overall|\s*---\s*|$)",
                ["Lexical Resource"] = @"###\s*Lexical Resource\s*\(Band:\s*(\d+)\)\s*(.*?)(?=###\s*Task|###\s*Coherence|###\s*Grammatical|###\s*Overall|\s*---\s*|$)",
                ["Grammatical Range and Accuracy"] = @"###\s*Grammatical Range and Accuracy\s*\(Band:\s*(\d+)\)\s*(.*?)(?=###\s*Task|###\s*Coherence|###\s*Lexical|###\s*Overall|\s*---\s*|$)"
            };

            foreach (var pattern in criteriaPatterns)
            {
                Console.WriteLine($"DEBUG: Trying pattern for {pattern.Key}");
                var match = Regex.Match(text, pattern.Value, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                if (match.Success)
                {
                    Console.WriteLine($"DEBUG: Found match for {pattern.Key} - Band: {match.Groups[1].Value}");
                    var bandScore = $"Band {match.Groups[1].Value}";
                    var fullContent = match.Groups[2].Value.Trim();

                    // Extract analysis section
                    var analysisMatch = Regex.Match(fullContent, @"\*\*Analysis:\*\*(.*?)(?=\*\*|$)", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                    var details = analysisMatch.Success ?
                        CleanCriterionDetails(analysisMatch.Groups[1].Value) :
                        CleanCriterionDetails(fullContent);

                    // Extract key points from bullet points
                    // var keyPoints = ExtractKeyPointsFromNewFormat(fullContent);

                    criteria[pattern.Key] = new Criterion
                    {
                        //  Name = pattern.Key,
                        Band = Int32.Parse(bandScore),
                        Analysis = details,
                        //KeyPoints = keyPoints
                    };
                }
                else
                {
                    Console.WriteLine($"DEBUG: No match found for {pattern.Key}");
                }
            }

            Console.WriteLine($"DEBUG: Total criteria extracted: {criteria.Count}");
        }

        // Extract key points from bullet points in new format
        private List<string> ExtractKeyPointsFromNewFormat(string content)
        {
            var keyPoints = new List<string>();

            if (string.IsNullOrEmpty(content))
                return keyPoints;

            // Pattern for bullet points: - **Title:** Description
            var bulletPattern = @"- \*\*([^*]+):\*\*\s*([^-\n]+)";
            var matches = Regex.Matches(content, bulletPattern, RegexOptions.Multiline);

            foreach (Match match in matches)
            {
                var title = match.Groups[1].Value.Trim();
                var description = match.Groups[2].Value.Trim();
                var keyPoint = $"{title}: {description}";

                if (keyPoint.Length > 10) // Filter out very short points
                {
                    keyPoints.Add(keyPoint);
                }
            }

            return keyPoints.Take(5).ToList(); // Limit to 5 key points
        }

        // Extract overall feedback from new format
        private string ExtractOverallFeedback(string text)
        {
            var feedbackPatterns = new[]
            {
                @"\*\*Feedback Summary:\*\*(.*?)(?=\*\*Key Strengths|$)",
                @"###\s*Overall Band:\s*\d+\s*(.*?)(?=\*\*Key Strengths|$)",
                @"\*\*Overall Assessment:\*\*(.*?)(?=\*\*|$)"
            };

            foreach (var pattern in feedbackPatterns)
            {
                var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase | RegexOptions.Singleline);
                if (match.Success)
                {
                    var feedback = match.Groups[1].Value.Trim();

                    // Also extract key strengths and areas for improvement
                    var strengthsMatch = Regex.Match(text, @"\*\*Key Strengths:\*\*(.*?)(?=\*\*Areas for Improvement|$)", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                    var improvementsMatch = Regex.Match(text, @"\*\*Areas for Improvement:\*\*(.*?)$", RegexOptions.IgnoreCase | RegexOptions.Singleline);

                    var fullFeedback = feedback;

                    if (strengthsMatch.Success)
                    {
                        fullFeedback += "\n\nKey Strengths:\n" + CleanCriterionDetails(strengthsMatch.Groups[1].Value);
                    }

                    if (improvementsMatch.Success)
                    {
                        fullFeedback += "\n\nAreas for Improvement:\n" + CleanCriterionDetails(improvementsMatch.Groups[1].Value);
                    }

                    return CleanCriterionDetails(fullFeedback);
                }
            }

            return "";
        }

        // Remove unused methods
        // ExtractCriterionDetails method removed as it's replaced by ExtractCriteriaFromNewFormat

        // Clean criterion details - updated for new format
        private string CleanCriterionDetails(string details)
        {
            if (string.IsNullOrEmpty(details))
                return "";

            // Clean up escape sequences and formatting
            details = details.Replace("\\n", "\n")
                          .Replace("\\\"", "\"")
                          .Replace("\\\\", "\\")
                          .Replace("nn", "\n\n")
                          .Replace("  n", "\n")
                          .Replace(" n", "\n")
                          .Replace("**", "")        // Remove bold formatting
                          .Replace("---", "")       // Remove separators
                          .Replace("\\t", "\t")
                          .Replace("\\r", "\r")
                          .Trim();

            // Clean up multiple spaces and newlines
            details = Regex.Replace(details, @"\s+", " ");
            details = Regex.Replace(details, @"\n\s*\n", "\n\n");

            return details;
        }

        // Cập nhật ExtractKeyPoints
        /*  private List<string> ExtractKeyPoints(string details)
          {
              var keyPoints = new List<string>();

              if (string.IsNullOrWhiteSpace(details))
                  return keyPoints;

              // Multiple patterns for bullet points
              var patterns = new[]
              {
          @"[*•]\s*\*\*([^*•\n]+?)\*\*([^*•\n]*)",  // **Bold** points
          @"[*•]\s*([^*•\n]+)",                       // Regular bullet points
          @"\n\s*([A-Z][^.]*\.)(?=\s|\n|$)"         // Sentence-like points
      };

              foreach (var pattern in patterns)
              {
                  var matches = Regex.Matches(details, pattern, RegexOptions.Multiline);
                  foreach (Match match in matches)
                  {
                      var point = match.Groups[1].Value.Trim();
                      if (match.Groups.Count > 2 && !string.IsNullOrEmpty(match.Groups[2].Value))
                      {
                          point += " " + match.Groups[2].Value.Trim();
                      }

                      if (!string.IsNullOrEmpty(point) && point.Length > 10) // Filter out very short points
                      {
                          keyPoints.Add(point);
                      }
                  }

                  if (keyPoints.Count > 0) break; // Use first successful pattern
              }

              return keyPoints.Take(5).ToList(); // Limit to 5 key points
          }*/

        // Helper method để sanitize text content
        public string SanitizeText(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            // Loại bỏ null characters và control characters
            var sanitized = new StringBuilder();
            foreach (char c in input)
            {
                // Giữ lại các ký tự printable và whitespace hợp lệ
                if (char.IsControl(c))
                {
                    if (c == '\r' || c == '\n' || c == '\t')
                    {
                        sanitized.Append(c);
                    }
                    // Skip các control characters khác
                }
                else if (char.IsSurrogate(c))
                {
                    // Skip surrogate characters có thể gây lỗi encoding
                    continue;
                }
                else
                {
                    sanitized.Append(c);
                }
            }

            return sanitized.ToString();
        }
    }
}
