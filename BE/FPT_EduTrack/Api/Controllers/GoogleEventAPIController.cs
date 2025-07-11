using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using FPT_EduTrack.DataAccessLayer.Entities;
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

        public GoogleEventAPIController(ITokenProvider tokenProvider, IMeetingService meetingService, IUnitOfWork unitOfWork, IEmailService emailService)
        {
            this.tokenProvider = tokenProvider;
            this.meetingService = meetingService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
        }

        //[HttpGet("token")]
        //public async Task<string> GetAccessTokenAsync()
        //{
        //    return await this.tokenService.GetAccessTokenAsync();
        //}

        //[HttpPost("event/create")]
        //public async Task<EventResponse> CreateEventAsync([FromBody]EventRequest eventRequest)
        //{
        //    return await this.meetingService.CreateEventAsync(eventRequest);
        //}

        [HttpPost("event/{meetingId}")]
        public async Task<EventResponse> GetEventById([FromQuery] string organizerEmail, string eventId)
        {
            return await this.meetingService.GetEventByIdAsync(organizerEmail, eventId);
        }

        [HttpPost("create-meeting")]
        public async Task<IActionResult> CreateMeetingAsync([FromBody] MeetingRequest request)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var response = await meetingService.CreateMeetingAsync(organizerEmail, request);
            return Ok(response);
        }

        [HttpPut("event/{meetingId}/update")]
        public async Task<IActionResult> UpdateEventAsync(string meetingId, [FromBody] MeetingRequest eventRequest)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var meeting = await _unitOfWork.MeetingRepository.GetByGoogleMeetingIdAsync(meetingId);
            if (meeting == null) return NotFound("Meeting not found.");

            return Ok(await this.meetingService.UpdateEventAsync(meeting.GoogleMeetingId, eventRequest, organizerEmail));
        }

        [HttpGet("events-organized")]
        public async Task<IActionResult> GetEventsOrganizeAsync()
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var events = await this.meetingService.GetEventsOrganizeAsync(organizerEmail);
            return Ok(events);
        }

        [HttpDelete("event/{meetingId}/delete")]
        public async Task<IActionResult> DeleteEventAsync(int meetingId)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var meeting = await _unitOfWork.MeetingRepository.GetByIdAsync(meetingId);
            if (meeting == null) return NotFound("Meeting not found.");

            await this.meetingService.DeleteMeetingAsync(meetingId, organizerEmail);

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
            return NoContent();
        }

        [HttpPost("send-to-attendees/{meetingId}")]
        public async Task<IActionResult> SendEmailsToAttendees(int meetingId)
        {
            var attendees = await meetingService.GetMeetingAttendees(meetingId);

            if (attendees == null || !attendees.Any())
                return NotFound("Không có người tham dự nào cho cuộc họp này.");

            foreach (var email in attendees)
            {
                if (!string.IsNullOrWhiteSpace(email))
                {
                    await _emailService.SendEmailAsync(new EmailDto
                    {
                        To = new List<string> { email },
                        Subject = "Thông báo cuộc họp",
                        Body = $"Bạn được mời tham dự cuộc họp (ID: {meetingId}). Vui lòng kiểm tra lịch."
                    });
                }
            }

            return Ok($"Đã gửi email tới {attendees.Count} người tham dự.");
        }
    }
}
