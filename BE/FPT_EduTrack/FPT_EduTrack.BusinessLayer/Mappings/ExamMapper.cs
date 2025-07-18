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
                Duration = exam.Duration,
                IsDeleted = exam.IsDeleted
            };
        }

        public static void ToUpdate(this Exam exam, ExamRequest examRequest)
        {
            if (exam == null || examRequest == null) return;
            exam.Code = examRequest.Code;
            exam.Name = examRequest.Name;
            exam.ExaminerId = examRequest.ExaminerId;
            exam.Duration = examRequest.Duration;
            exam.IsDeleted = false;
            exam.CreatedAt = DateTime.UtcNow; // Assuming CreatedAt should be updated on edit
        }

        public static Exam ToEntity(this ExamRequest examRequest)
        {
            if (examRequest == null) return null;
            return new Exam
            {
                Code = examRequest.Code,
                Name = examRequest.Name,
                ExaminerId = examRequest.ExaminerId,
                Duration = examRequest.Duration,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
