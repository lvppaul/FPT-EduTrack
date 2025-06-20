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
    public static class ReportMapper
    {
        public static ReportResponse ToResponse(this Report report)
        {
            if (report == null) return null;
            return new ReportResponse
            {
                Id = report.Id,
                Title = report.Title ?? string.Empty,
                Content = report.Content ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                IsSecond = report.IsSecond ?? false,
                IsDeleted = report.IsDeleted ?? false,
                StudentId = report.StudentId,
                ReportStatusId = report.ReportStatusId,
                TestId = report.TestId
            };
        }

        public static List<ReportResponse> ToDtoList(this IEnumerable<Report> reports)
        {
            return reports?.Select(r => r.ToResponse()).ToList() ?? new List<ReportResponse>();
        }

        public static Report ToEntity(this ReportRequest request)
        {
            if (request == null) return null;
            return new Report
            {
                Title = request.Title,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                IsSecond = false,
                StudentId = request.StudentId,
                TestId = request.TestId,
                ReportStatusId = 1
            };
        }
        public static void ToUpdate(this ReportUpdate request, Report report)
        {
            if (request == null || report == null) return;
            report.Title = request.Title;
            report.Content = request.Content;
            report.StudentId = request.StudentId;
            report.TestId = request.TestId;
            if (request.IsSecond.HasValue)
            {
                report.IsSecond = request.IsSecond;
            }
            if (request.IsDeleted.HasValue)
            {
                report.IsDeleted = request.IsDeleted;
            }
            if(request.ReportStatusId.HasValue)
            {
                report.ReportStatusId = request.ReportStatusId;
            }
        }
    }
}
