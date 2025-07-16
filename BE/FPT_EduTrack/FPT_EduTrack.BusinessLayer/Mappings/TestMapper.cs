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
        public static TestResponse ToResponse(Test test)
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
                StudentId = test.StudentId,
                LecturersTestsDetailResponse = test.LecturersTestsDetails?
                    .Select(detail => detail?.ToResponse()).ToList() ?? new List<LecturersTestsDetailResponse>(),
                hasReport = test.Reports != null && test.Reports.Any(),
                StudentName = test.Student?.Fullname?.Trim() ?? "Unknown",
                TestsScores = test.TestsScores?.FirstOrDefault()?.Score ?? 0.0
            };
        }
    }
}
