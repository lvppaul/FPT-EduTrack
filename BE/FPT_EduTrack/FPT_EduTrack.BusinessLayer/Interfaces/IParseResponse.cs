using FPT_EduTrack.BusinessLayer.DTOs.Response;
using Microsoft.AspNetCore.Http;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IParseResponse
    {
        GradingResponse ParseLangflowResponse(string rawResponse);
        string SanitizeText(string input);
        Task<string> ReadFileAsync(IFormFile file);
    }
}
