namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class GradingResponse
    {
        public string? SessionId { get; set; }
        public string? Timestamp { get; set; }
        public double OverallBand { get; set; }
        public Dictionary<string, Criterion> Criteria { get; set; } = new();
        public string Justification { get; set; } = "";
        //public string FullEvaluation { get; set; } = "";
        public string? Source { get; set; }
    }
}
