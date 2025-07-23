using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Exceptions;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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

        [HttpGet("getUser")]
        public async Task<IActionResult> GetAllUser([FromQuery] Pagination pagination)
        {
            try
            { 
                var users = await _service.GetAllAsyncWithPagination(pagination);
                var totalUser = await _service.GetAllAsync();
                if (users == null || !users.Any())
                    return NotFound(new
                    {
                        success = false,
                        message = "No users found",
                        timestamp = DateTime.UtcNow
                    });
                return Ok( new
                {
                    success = true,
                    message = "User retrieved successfully",
                    data = users,
                    cound = totalUser.Count(),
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving users",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdate userUpdate)
        {
            try
            {

                if (userUpdate == null || userUpdate.Id <= 0)
                    return BadRequest(new
                    {
                        Success = false,
                        Message = "Invalid user update information input",
                        timestamp = DateTime.UtcNow
                    });
                var userExist = await _service.GetByIdAsync(id);
                if (userExist == null || userExist.Id == 0)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "User not found",
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    var updateUser = await _service.UpdateAsync(userUpdate);
                    if(updateUser == null)
                    {
                        return StatusCode(500, new
                        {
                            success = false,
                            message = "Failed to update exam."
                        });
                    }else
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "User updated successfully.",
                            data = updateUser
                        });
                    }                  
                }
            }
            catch (Exception ex)

            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Something wrong happends when updating user information",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpDelete("delete/{userID}")]
        public async Task<IActionResult> DeleteUser(int userID)
        {
            try
            {
                if (userID <= 0)
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid user id",
                        timestamp = DateTime.UtcNow
                    });
                var isDeleted = await _service.DeleteAsync(userID);

                if (!isDeleted)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Delete failed",
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Delete successfully",
                        timestamp = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Something wrong when deleting User",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }



        [HttpDelete("setActive/{userID}")]
        public async Task<IActionResult> SetActive(int userID)
        {
            try
            {
                if (userID <= 0)
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid user id",
                        timestamp = DateTime.UtcNow
                    });
                var isDeleted = await _service.SetActive(userID);

                if (!isDeleted)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Delete failed",
                        timestamp = DateTime.UtcNow
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Delete successfully",
                        timestamp = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Something wrong when deleting User",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
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

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshTokenAsync(RefreshTokenRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required" });
            }

            var result = await _service.RefreshTokenAsync(request.RefreshToken);

            if (result == null)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
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

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] UserRequest user)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            try
            {
                var createdUser = await _service.RegisterAsync(user);
                var response = UserMapper.ToResponse(createdUser);
                return CreatedAtAction(nameof(GetByEmail), new { email = response.Email }, response);
            }
            catch (UserAlreadyExistsException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (WeakPasswordException ex)
            {
                return BadRequest(new { errors = ex.Errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
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
