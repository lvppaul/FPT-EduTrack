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
