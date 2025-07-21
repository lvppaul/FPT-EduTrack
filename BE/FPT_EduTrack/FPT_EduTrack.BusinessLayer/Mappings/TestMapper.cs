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
    public static class TestMapper
    {
        public static TestResponse ToResponse(this Test test)
        {
            if (test == null)
                throw new ArgumentNullException(nameof(test));
            
            return new TestResponse
            {
                Id = test.Id,
                Code = test.Code?.Trim(),
                Title = test.Title?.Trim(),
                Content = test.Content?.Trim(),
                Link = test.Link?.Trim(),
                ExamId = test.ExamId,
                StudentId = test.StudentId,
                StudentName = test.Student?.Fullname?.Trim() ?? "Unknown",
                hasReport = test.Reports != null && test.Reports.Any(),
                TestsScores = (float)test.Score,
                isDeleted = test.isDeleted ?? false,
                LecturersTestsDetailResponse = test.LecturersTestsDetails?
                    .Select(detail => detail?.ToResponse()).ToList() ?? new List<LecturersTestsDetailResponse>()
            };
        }
    }
}
