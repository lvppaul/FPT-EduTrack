using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using GoogleCalendarAPI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleEventAPIController : ControllerBase
    {
        private readonly ITokenService tokenService;
        private readonly IMeetingService meetingService;

        public GoogleEventAPIController(ITokenService tokenService, IMeetingService meetingService)
        {
            this.tokenService = tokenService;
            this.meetingService = meetingService;
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
        public async Task<IActionResult> CreateMeetingAsync([FromQuery] string organizerEmail, [FromBody] CreateMeetingRequest request)
        {
            var response = await meetingService.CreateMeetingAsync(organizerEmail, request);
            return Ok(response);
        }

    }
}
