using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FPT_EduTrack.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;
        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.LoginAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpGet("email/{email}")]
        [Authorize]
        public async Task<IActionResult> GetByEmail(string email)
        {
            // Validate email format
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid email format",
                    timestamp = DateTime.UtcNow
                });
            }

            // Get current user info
            var currentUserRole = User.FindFirst("Role").Value;
            var currentUserEmail = User.FindFirst(ClaimTypes.Email).Value;


            // Authorization check: Users can only get their own profile unless they're Admin
            if (email.ToLowerInvariant() != currentUserEmail.ToLowerInvariant() &&
                currentUserRole != "Admin")
            {
                return Forbid();
            }

            try
            {
                var result = await _service.GetByEmailAsync(email);

                if (result == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "User not found with the provided email",
                        timestamp = DateTime.UtcNow
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving user",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRequest user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _service.RegisterAsync(user);
                return CreatedAtAction(nameof(GetByEmail), new { email = user.Email }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(400, new
                {
                    success = false,
                    message = "An error occurred while registering user",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}
