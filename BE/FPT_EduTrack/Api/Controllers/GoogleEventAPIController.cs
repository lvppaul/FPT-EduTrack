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

            var subject = "Lời mời tham gia cuộc họp Google Meet";

            var body = $"Xin chào,<br/><br/>" +
            $"Bạn được mời tham gia cuộc họp \"{response.Summary}\" do {organizerEmail} tổ chức.<br/><br/>" +
            $"- 🗓 **Thời gian**: {response.Start.DateTime:dd/MM/yyyy HH:mm} - {response.End.DateTime:HH:mm}<br/>" +
            $"- 📍 **Hình thức họp**: Trực tuyến qua Google Meet<br/>" +
            $"- 🔗 **Link tham gia**: {response.HangoutLink}<br/><br/>" +
            $"Vui lòng tham gia đúng giờ và kiểm tra thiết bị trước cuộc họp.<br/><br/>" +
            $"Trân trọng,<br/>Đội ngũ hỗ trợ";

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
            if (attendees != null && attendees.Any())
            {
                foreach (var email in attendees)
                {
                    if (!string.IsNullOrWhiteSpace(email))
                    {
                        await _emailService.SendEmailAsync(new EmailDto
                        {
                            To = new List<string> { email },
                            Subject = "Thông báo cập nhật lịch họp",
                            Body = $"Xin chào,<br/><br/>" +
                                   $"Lịch họp \"{updatedMeeting.Summary}\" mà bạn tham gia đã được cập nhật với thông tin mới như sau:<br/><br/>" +
                                   $"- 🗓 **Thời gian mới**: {updatedMeeting.Start.DateTime:dd/MM/yyyy HH:mm} - {updatedMeeting.End.DateTime:HH:mm}<br/>" +
                                   $"- 📍 **Hình thức họp**: Trực tuyến qua Google Meet<br/>" +
                                   $"- 🔗 **Link tham gia**: {updatedMeeting.HangoutLink}<br/><br/>" +
                                   $"Vui lòng kiểm tra lại lịch trình cá nhân và tham gia đúng giờ.<br/><br/>" +
                                   $"Trân trọng,<br/>Đội ngũ hỗ trợ"
                        });
                    }
                }
            }

            return Ok(updatedMeeting);
        }

        [HttpGet("events-organized")]
        public async Task<IActionResult> GetEventsOrganizeAsync()
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(organizerEmail))
                return Unauthorized("Email claim not found in token");

            var listEvent = await this.meetingService.GetEventsOrganizeAsync(organizerEmail);
            if (listEvent == null || !listEvent.Any())
                return NotFound("No events found for the organizer.");

            return Ok(listEvent);
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
