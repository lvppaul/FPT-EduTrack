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
        public static ReportDataResponse ToResponse(this Report report)
        {
            if (report == null) return null;

            var lecturerDetail = report.Test?.LecturersTestsDetails.FirstOrDefault();

            return new ReportDataResponse
            {
                Id = report.Id,
                Title = report.Title ?? string.Empty,
                Content = report.Content ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                IsSecond = report.IsSecond ?? false,
                IsDeleted = report.IsDeleted ?? false,
                StudentId = report.StudentId,
                StudentName = report.Student?.Fullname ?? string.Empty,
                ReportStatusId = report.ReportStatusId,
                TestId = report.TestId,
                TestCode = report.Test?.Code ?? string.Empty,
                TestTitle = report.Test?.Title ?? string.Empty,
                TestContent = report.Test?.Content ?? string.Empty,
                TestLink = report.Test?.Link ?? string.Empty,
                LecturerId = lecturerDetail?.LecturerId,
                LecturerName = lecturerDetail?.Lecturer?.Fullname ?? string.Empty
            };
        }

        public static List<ReportDataResponse> ToDtoList(this IEnumerable<Report> reports)
        {
            return reports?.Select(r => r.ToResponse()).ToList() ?? new List<ReportDataResponse>();
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
        }
    }
}
