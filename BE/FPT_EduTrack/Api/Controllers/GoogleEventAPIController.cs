using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using GoogleCalendarAPI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleEventAPIController : ControllerBase
    {
        private readonly ITokenProvider tokenProvider;
        private readonly IMeetingService meetingService;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailTemplateService _templateService;

        public GoogleEventAPIController(ITokenProvider tokenProvider, IMeetingService meetingService, IUnitOfWork unitOfWork, IEmailService emailService, IEmailTemplateService templateService)
        {
            this.tokenProvider = tokenProvider;
            this.meetingService = meetingService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _templateService = templateService;
        }

        [HttpGet("event/{meetingId}")]
        public async Task<IActionResult> GetEventById(int meetingId)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var response = await this.meetingService.GetEventByMeetingIdAsync(organizerEmail, meetingId);
            if (response == null)
                return NotFound(new { success = false, message = $"Meeting id {meetingId} not found." });
            return Ok(new { success = true, data = response });
        }

        [HttpPost("create-meeting")]
        public async Task<IActionResult> CreateMeetingAsync([FromBody] MeetingRequest request)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var response = await meetingService.CreateMeetingAsync(organizerEmail, request);

            var subject = _templateService.GetMeetingInvitationSubject();
            var body = _templateService.GetMeetingInvitationBody(response, organizerEmail);

            foreach (var attendee in request.AttendeeEmails)
            {
                if (!string.IsNullOrWhiteSpace(attendee.Email))
                {
                    await _emailService.SendEmailAsync(new EmailDto
                    {
                        To = new List<string> { attendee.Email },
                        Subject = subject,
                        Body = body
                    });
                }
            }
            return Ok(response);
        }

        [HttpPut("event/{meetingId}/update")]
        public async Task<IActionResult> UpdateEventAsync(int meetingId, [FromBody] MeetingRequest eventRequest)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var meeting = await _unitOfWork.MeetingRepository.GetByIdAsync(meetingId);

            var meetingGG = await _unitOfWork.MeetingRepository.GetByGoogleMeetingIdAsync(meeting.GoogleMeetingId);

            if (meetingGG == null) return NotFound("Meeting not found.");

            var updatedMeeting = await this.meetingService.UpdateEventAsync(meetingGG.GoogleMeetingId, eventRequest, organizerEmail);

            var attendees = await meetingService.GetMeetingAttendees(meetingId);
            
            var subject = _templateService.GetMeetingUpdateSubject();

            var body = _templateService.GetMeetingUpdateBody(updatedMeeting, organizerEmail);

            if (attendees != null && attendees.Any())
            {
                foreach (var email in attendees)
                {
                    if (!string.IsNullOrWhiteSpace(email))
                    {
                        await _emailService.SendEmailAsync(new EmailDto
                        {
                            To = new List<string> { email },
                            Subject = subject,
                            Body = body
                        });
                    }
                }
            }

            return Ok(updatedMeeting);
        }

        [HttpGet("events-organized")]
        public async Task<IActionResult> GetEventsOrganizeAsync([FromQuery]Pagination pagination)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var listEventPagination = await this.meetingService.GetEventsOrganizePaginationAsync(organizerEmail, pagination);
            if (listEventPagination == null || !listEventPagination.Any())
                return NotFound("No events found for the organizer.");

            var listEvent = await this.meetingService.GetEventsOrganizeAsync(organizerEmail);

            return Ok(new
            {
                success = true,
                message = "Meeting retrieved true",
                data = listEventPagination,
                count = listEvent.Count
            });
        }

        [HttpDelete("event/{meetingId}/delete")]
        public async Task<IActionResult> DeleteEventAsync(int meetingId)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var meeting = await _unitOfWork.MeetingRepository.GetByIdAsync(meetingId);
            if (meeting == null)
                return NotFound("Meeting not found.");

            if (string.IsNullOrEmpty(meeting.GoogleMeetingId))
                return BadRequest("GoogleMeetingId is missing. Cannot delete event from Google Calendar.");

            if (await meetingService.DeleteMeetingAsync(meeting.GoogleMeetingId, organizerEmail)) { 
            
            var attendees = await meetingService.GetMeetingAttendees(meetingId);
                if (attendees != null && attendees.Any())
                {
                    foreach (var email in attendees)
                    {
                        if (!string.IsNullOrWhiteSpace(email))
                        {
                            await _emailService.SendEmailAsync(new EmailDto
                            {
                                To = new List<string> { email },
                                Subject = "Hủy cuộc họp",
                                Body = $"Cuộc họp (ID: {meetingId}) đã bị hủy bởi {organizerEmail}."
                            });
                        }
                    }
                }
            }
            return Ok(new
            {
                success = true,
                message = "Meeting deleted successfully."
            });
        }
    }
}
