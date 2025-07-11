using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using GoogleCalendarAPI;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
        private readonly ITokenProvider tokenProvider;
        private readonly IUnitOfWork _unitOfWork;

        public MeetingService(ITokenProvider tokenProvider, IUnitOfWork unitOfWork)
        {
            this.restClient = new RestClient("https://www.googleapis.com/calendar/v3/calendars/");
            this.tokenProvider = tokenProvider;
            _unitOfWork = unitOfWork;
        }
        public async Task<EventResponse> CreateEventAsync(EventRequest eventRequest, string organizerEmail)
        {

            var restRequest = new RestRequest("primary/events", Method.Post);
            restRequest.AddQueryParameter("conferenceDataVersion", "1");

            var accessToken = await this.tokenProvider.GetAccessTokenAsync(organizerEmail);
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
            var accessToken = await this.tokenProvider.GetAccessTokenAsync(email);
            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            return await this.restClient.GetAsync<EventResponse>(restRequest);
        }

        public Task<List<EventResponse>> GetEventsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<EventResponse> UpdateEventAsync(string eventId, MeetingRequest eventRequest, string organizerEmail)
        {
            var restRequest = new RestRequest($"primary/events/{eventId}", Method.Put);
            var accessToken = await this.tokenProvider.GetAccessTokenAsync(organizerEmail);

            restRequest.AddHeader("Authorization", $"Bearer {accessToken}");

            var body = new
            {
                summary = eventRequest.Summary,
                description = eventRequest.Description,
                start = new
                {
                    dateTime = eventRequest.StartTime.DateTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                    timeZone = eventRequest.StartTime.TimeZone ?? "Asia/Ho_Chi_Minh"
                },
                end = new
                {
                    dateTime = eventRequest.EndTime.DateTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                    timeZone = eventRequest.EndTime.TimeZone ?? "Asia/Ho_Chi_Minh"
                },
                attendees = eventRequest.AttendeeEmails.Select(x => new
                {
                    email = x.Email,
                    responseStatus = "accepted"
                }).ToList()
            };

            restRequest.AddJsonBody(body);

            var meetingExist = await _unitOfWork.MeetingRepository.GetByGoogleMeetingIdAsync(eventId);
            if (meetingExist == null)
            {
                throw new Exception($"Meeting with ID {eventId} does not exist.");
            }

            var response = await this.restClient.PutAsync<EventResponse>(restRequest);

            var meeting = MeetingMapper.ToEntity(response);

            meetingExist.Name = meeting.Name;
            meetingExist.Link = meeting.Link;
            meetingExist.GoogleMeetingId = meeting.GoogleMeetingId;
            meetingExist.MeetingStatusId = meeting.MeetingStatusId;
            meetingExist.CreatedAt = meeting.CreatedAt;
            meetingExist.StartTime = meeting.StartTime;
            meetingExist.EndTime = meeting.EndTime;

            await _unitOfWork.MeetingRepository.SaveAsync();

            return response;
        }

        public async Task<EventResponse> CreateMeetingAsync(string organizerEmail, MeetingRequest request)
        {
            var eventRequest = new EventRequest
            {
                Summary = request.Summary,
                Description = request.Description,
                Start = new EventDateTime
                {
                    DateTime = request.StartTime.DateTime,
                    TimeZone = request.StartTime.TimeZone ?? "Asia/Ho_Chi_Minh"
                },
                End = new EventDateTime
                {
                    DateTime = request.EndTime.DateTime,
                    TimeZone = request.StartTime.TimeZone ?? "Asia/Ho_Chi_Minh"
                },
                Attendees = request.AttendeeEmails.Select(email => new EventAttendee
                {
                    Email = email.Email,
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

            foreach (var attendeeEmail in request.AttendeeEmails)
            {
                var user = await _unitOfWork.UserRepository.GetByEmailAsync(attendeeEmail.Email);
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

        public async Task<List<EventResponse>> GetEventsOrganizeAsync(string organizerEmail)
        {
            try
            {
                var restRequest = new RestRequest("primary/events");
                restRequest.AddParameter("singleEvents", "true");
                restRequest.AddParameter("orderBy", "startTime");

                var accessToken = await this.tokenProvider.GetAccessTokenAsync(organizerEmail);
                restRequest.AddHeader("Authorization", $"Bearer {accessToken}");

                // Execute without generic type parameter
                var response = await this.restClient.ExecuteAsync(restRequest);

                if (!response.IsSuccessful)
                {
                    throw new Exception($"Google API Error:\nStatus: {response.StatusCode}\nContent: {response.Content}\nError: {response.ErrorMessage}");
                }

                // Parse the JSON manually to extract the items array
                var jsonResponse = JObject.Parse(response.Content);
                var itemsJson = jsonResponse["items"]?.ToString();

                if (string.IsNullOrEmpty(itemsJson))
                {
                    return new List<EventResponse>();
                }

                var allEvents = JsonConvert.DeserializeObject<List<EventResponse>>(itemsJson);

                // Filter events
                var events = allEvents
                    .Where(e => e != null &&
                        e.Organizer.Email.Equals(organizerEmail))
                    .ToList();

                return events;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving events for organizer '{organizerEmail}': {ex.Message}", ex);
            }
        }

        public async Task DeleteMeetingAsync(int meetingId, string organizerEmail)
        {
            //var restRequest = new RestRequest($"primary/events/{meetingId}", Method.Delete);
            //var accessToken = await this.tokenProvider.GetAccessTokenAsync(organizerEmail);
            //restRequest.AddHeader("Authorization", $"Bearer {accessToken}");
            //var response = await this.restClient.ExecuteAsync(restRequest);

            //if (!response.IsSuccessful)
            //{
            //    throw new Exception($"Google API Error:\nStatus: {response.StatusCode}\nContent: {response.Content}");
            //}
            //var existingMeeting = await _unitOfWork.MeetingRepository.GetByIdAsync(meetingId);
            //if (existingMeeting != null)
            //{
            //    _unitOfWork.MeetingRepository.Remove(existingMeeting);
            //    await _unitOfWork.SaveAsync();
            //}
            var meeting = await _unitOfWork.MeetingRepository.GetByIdAsync(meetingId);
            if (meeting == null)
            {
                throw new Exception($"Meeting with ID {meetingId} does not exist.");
            }
            meeting.IsDeleted = true;
            await _unitOfWork.MeetingRepository.UpdateAsync(meeting);
        }

        public async Task<List<string>> GetMeetingAttendees(int meetingId)
        {
            return await _unitOfWork.MeetingRepository.GetMeetingAttendees(meetingId);
        }
    }
}
