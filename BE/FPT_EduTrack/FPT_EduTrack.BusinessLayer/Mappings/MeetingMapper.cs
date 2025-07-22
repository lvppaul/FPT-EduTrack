using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using GoogleCalendarAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class MeetingMapper
    {
        #region Entity to Response
        public static MeetingResponse ToRequest(this Meeting meeting)
        {
            return new MeetingResponse
            {
                Id = meeting.Id,
                Name = meeting.Name,
                CreatedAt = meeting.CreatedAt,
                Link = meeting.Link,
                MeetingStatusId = meeting.MeetingStatusId,
                MeetingStatusName = meeting.MeetingStatus?.Name,
            };
        }
        #endregion

        #region Request to Entity
        public static Meeting ToEntity(this EventResponse request)
        {
            return new Meeting
            {
                Name = request.Summary,
                Link = request.HangoutLink,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                GoogleMeetingId = request.Id,
                MeetingStatusId = 1,
                StartTime = request.Start?.DateTime,
                EndTime = request.End?.DateTime,
            };
        }
        #endregion
    }
}
