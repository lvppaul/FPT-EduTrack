using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class ExamMapper
    {
        public static ExamResponse MapToDTO(Exam exam)
        {
            return new ExamResponse
            {
                Id = exam.Id,
                Code = exam.Code,
                CreatedAt = exam.CreatedAt,
                Name = exam.Name,
                ExaminerId = exam.ExaminerId,
                ExaminerName = exam.Examiner?.Fullname,
                Status = exam.Status,
                Duration = exam.Duration,
                IsDeleted = exam.IsDeleted,
                Test = exam.Tests?.Select(TestMapper.ToResponse).ToList() ?? new List<TestResponse>()
            };
        }

        public static void ToUpdate(this Exam exam, ExamRequest examRequest)
        {
            if (exam == null || examRequest == null) return;
            exam.Code = examRequest.Code;
            exam.Name = examRequest.Name;
            exam.ExaminerId = examRequest.ExaminerId;
            exam.Duration = examRequest.Duration;
            exam.Status = examRequest.Status?.ToString() ?? exam.Status; // Convert enum to string, preserve existing if not provided
            exam.IsDeleted = false;
            exam.CreatedAt = DateTime.UtcNow;
        }

        public static Exam? ToEntity(this ExamRequest examRequest)
        {
            if (examRequest == null) return null;
            return new Exam
            {
                Code = examRequest.Code,
                Name = examRequest.Name,
                ExaminerId = examRequest.ExaminerId,
                Duration = examRequest.Duration,
                Status = examRequest.Status?.ToString() ?? ExamStatus.InProgress.ToString(), // Convert enum to string, default to InProgress
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
