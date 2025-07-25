﻿using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
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
        Task<List<MeetingResponse>> GetEventsOrganizeAsync(string organizerEmail);
        Task<List<MeetingResponse>> GetEventsOrganizePaginationAsync(string organizerEmail, Pagination pagination);
        Task<bool> DeleteMeetingAsync(string meetingId, string organizerEmail);
        Task<List<string>> GetMeetingAttendees(int meetingId);
        Task<EventResponse> GetEventByMeetingIdAsync(string organizerEmail, int meetingId);

        //---Examiner---//
        Task<int> UpdateMeetingStatus(int meetingId,int statusId);
    }
}
