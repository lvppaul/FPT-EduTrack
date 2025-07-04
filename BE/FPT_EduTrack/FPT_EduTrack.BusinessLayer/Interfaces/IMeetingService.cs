using FPT_EduTrack.BusinessLayer.DTOs.Request;
using GoogleCalendarAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IMeetingService
    {
        Task<EventResponse> CreateEventAsync(EventRequest eventRequest, string organizerEmail);
        Task<EventResponse> UpdateEventAsync(string eventId, MeetingRequest eventRequest, string organizerEmail);
        Task<EventResponse> GetEventByIdAsync(string email, string eventId);
        Task<List<EventResponse>> GetEventsAsync();
        Task<EventResponse> CreateMeetingAsync(string organizerEmail, MeetingRequest request);
        Task<List<EventResponse>> GetEventsOrganizeAsync(string organizerEmail);
        Task DeleteMeetingAsync(int meetingId, string organizerEmail);
    }
}
