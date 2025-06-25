using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using GoogleCalendarAPI;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class MeetingService : IMeetingService
    {
        private readonly IRestClient restClient;
        private readonly ITokenService tokenService;
        private readonly IUnitOfWork _unitOfWork;

        public MeetingService(ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            this.restClient = new RestClient("https://www.googleapis.com/calendar/v3/calendars/");
            this.tokenService = tokenService;
            _unitOfWork = unitOfWork;
        }
        public async Task<EventResponse> CreateEventAsync(EventRequest eventRequest, string organizerEmail)
        {

            var restRequest = new RestRequest("primary/events", Method.Post);
            restRequest.AddQueryParameter("conferenceDataVersion", "1");

            var accessToken = await this.tokenService.GetAccessTokenAsync(organizerEmail);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            restRequest.AddHeader("Content-Type", "application/json");

            restRequest.AddJsonBody(eventRequest);

            var response = await this.restClient.ExecuteAsync<EventResponse>(restRequest);

            if (!response.IsSuccessful)
            {
                throw new Exception($"Google API Error:\nStatus: {response.StatusCode}\nContent: {response.Content}");
            }

            return response.Data!;
        }

        public async Task<EventResponse> GetEventByIdAsync(string email, string eventId)
        {
            var restRequest = new RestRequest($"primary/events/{eventId}");
            var accessToken = await this.tokenService.GetAccessTokenAsync(email);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            return await this.restClient.GetAsync<EventResponse>(restRequest);
        }

        public Task<List<EventResponse>> GetEventsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<EventResponse> UpdateEventAsync(string eventId, EventRequest eventRequest)
        {
            throw new NotImplementedException();
        }

        public async Task<EventResponse> CreateMeetingAsync(string organizerEmail,CreateMeetingRequest request)
        {
            var eventRequest = new EventRequest
            {
                Summary = request.Title,
                Description = request.Description,
                Start = new EventDateTime
                {
                    DateTime = request.StartTime,
                    TimeZone = "Asia/Ho_Chi_Minh"
                },
                End = new EventDateTime
                {
                    DateTime = request.EndTime,
                    TimeZone = "Asia/Ho_Chi_Minh"
                },
                Attendees = request.AttendeeEmails.Select(email => new EventAttendee
                {
                    Email = email,
                    ResponseStatus = "accepted"
                }).ToList(),

                ConferenceData = new ConferenceData
                {
                    CreateRequest = new CreateConferenceRequest
                    {
                        RequestId = Guid.NewGuid().ToString(),
                        ConferenceSolutionKey = new ConferenceSolutionKey
                        {
                            Type = "hangoutsMeet"
                        }
                    }
                }
            };

            var eventResponse = await CreateEventAsync(eventRequest, organizerEmail);

            var meeting = MeetingMapper.ToEntity(eventResponse);

            await _unitOfWork.MeetingRepository.CreateAsync(meeting);

            foreach(var attendeeEmail in request.AttendeeEmails)
            {
                var user = await _unitOfWork.UserRepository.GetByEmailAsync(attendeeEmail);
                if (user != null)
                {
                    await _unitOfWork.MeetingDetailRepository.CreateAsync(new MeetingDetail
                    {
                        UserId = user.Id,
                        MeetingId = meeting.Id
                    });
                }
            }

            return eventResponse;
        }
    }
}
