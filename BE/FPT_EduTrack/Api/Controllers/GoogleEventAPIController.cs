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
        private readonly IUnitOfWork _unitOfWork;

        public GoogleEventAPIController(ITokenProvider tokenProvider, IMeetingService meetingService, IUnitOfWork unitOfWork)
        {
            this.tokenProvider = tokenProvider;
            this.meetingService = meetingService;
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
        public async Task<IActionResult> UpdateEventAsync(string meetingId, [FromBody]MeetingRequest eventRequest)
        {
            var organizerEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var meeting = await _unitOfWork.MeetingRepository.GetByGoogleMeetingIdAsync(meetingId);
            if (meeting == null) return NotFound("Meeting not found.");

            return Ok(await this.meetingService.UpdateEventAsync(meeting.GoogleMeetingId, eventRequest, organizerEmail));
        }
    }
}
