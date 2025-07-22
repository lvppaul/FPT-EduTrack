using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class ReportFeedbackMapper
    {
        public static ReportFeedbackResponse ToResponse(this ReportFeedback reportFeedback)
        {
            if (reportFeedback == null) return null;

            return new ReportFeedbackResponse
            {
                Id = reportFeedback.Id,
                CreatedAt = new DateTime(),
                ExaminerId = reportFeedback.ExaminerId,
                Feedback = reportFeedback.Feedback,
                ReExamScore = reportFeedback.ReExamScore,
                ReportFeedbackStatusId = reportFeedback.ReportFeedbackStatusId,
                ReportId = reportFeedback.ReportId,
            };
        }

        public static List<ReportFeedbackResponse> ToDtoList(this IEnumerable<ReportFeedback> reportFeedbacks)
        {
            return reportFeedbacks?.Select(r => r.ToResponse()).ToList() ?? new List<ReportFeedbackResponse>();
        }

        public static ReportFeedback ToEntity(this ReportFeedbackRequest request)
        {
            if (request == null) return null;
            return new ReportFeedback
            {
                CreatedAt = DateTime.UtcNow,
                ExaminerId = request.ExaminerId,
                Feedback = request.Feedback,
                ReportId = request.ReportId,
                ReportFeedbackStatusId = request.ReportFeedbackStatusId,
                ReExamScore = request.ReExamScore,
            };
        }
        public static void ToUpdate(this ReportFeedbackUpdate request, ReportFeedback reportFeedback)
        {
            if (request == null || reportFeedback == null) return;
            reportFeedback.Feedback = request.Feedback;
            reportFeedback.ReExamScore = request.ReExamScore;
        }
    }
}
