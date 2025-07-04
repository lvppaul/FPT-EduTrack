using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleAuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly ITokenProvider _tokenProvider;
        private readonly IUserService _userService;

        public GoogleAuthController(IConfiguration configuration, ITokenProvider tokenProvider, IUserService userService)
        {
            this.configuration = configuration;
            _tokenProvider = tokenProvider;
            _userService = userService;
        }

        [HttpGet("GetAuthUrl")]
        public IActionResult GetAuthUrl()
        {
            var email = User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            var url = "https://accounts.google.com/o/oauth2/v2/auth?" +
                $"scope={this.configuration.GetValue<string>("Scope")}" +
                $"&access_type=offline" +
                $"&response_type=code" +
                $"&state={email}" +
                $"&redirect_uri={this.configuration.GetValue<string>("RedirectUrl")}" +
                $"&client_id={this.configuration.GetValue<string>("ClientId")}" +
                $"&prompt=consent";

            return Ok(new { url });
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
        {
            var token = await _tokenProvider.GetTokenAsync(code);

            var email = state;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("User is not authenticated.");
            }

            var expiredAt = DateTime.UtcNow.AddSeconds(token.expires_in);

            await _userService.SaveGoogleTokenAsync(email, token.access_token, token.refresh_token, expiredAt);

            return Redirect("/swagger");
        }
    }
}
