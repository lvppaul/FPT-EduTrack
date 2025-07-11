using FPT_EduTrack.BusinessLayer.DTOs.Response;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IParseResponse
    {
        GradingResponse ParseLangflowResponse(string rawResponse);
        string SanitizeText(string input);
    }
}
