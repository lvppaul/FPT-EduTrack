namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class GradingResult
    {
        public string OverallBand { get; set; } = "";
        public Dictionary<string, Criterion> Criteria { get; set; } = new();
        public string Justification { get; set; } = "";
    }
}
