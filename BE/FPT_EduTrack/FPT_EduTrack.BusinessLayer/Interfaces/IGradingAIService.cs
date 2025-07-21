using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using Microsoft.Extensions.Logging;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IGradingAIService
    {
        Task<GradingAIResponse> ProcessGradingAsync(GradingFileRequest request);
    }
}
