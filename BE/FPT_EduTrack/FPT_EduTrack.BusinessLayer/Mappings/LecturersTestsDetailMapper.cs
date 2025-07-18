using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class LecturersTestsDetailMapper
    {
        public static LecturersTestsDetailResponse ToResponse(this LecturersTestsDetail detail)
        {
            if (detail == null) return null;
            return new LecturersTestsDetailResponse
            {
                TestId = detail.TestId,
                LecturerId = detail.LecturerId,
                Score = detail.Score,
                Reason = detail.Reason,
                isGrading = detail.isGrading,
                Lecturer = detail.Lecturer?.ToResponse() // Assuming UserMapper has a ToResponse method
            };
        }
    }
}
