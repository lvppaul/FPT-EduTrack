using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Exceptions;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using Microsoft.AspNetCore.Http.HttpResults;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenProvider _tokenProvider;
        public UserService(IUnitOfWork unitOfWork, ITokenProvider tokenProvider)
        {
            _unitOfWork = unitOfWork;
            _tokenProvider = tokenProvider;
        }
        public Task<UserResponse> CreateAsync(UserRequest user)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteAsync(int userId)
        { 
            var user = await _unitOfWork.UserRepository.GetByIdAsync(userId);
            if (user == null)
                return false;
            try
            {
                await _unitOfWork.UserRepository.DeleteAsync(user);
                await _unitOfWork.CommitTransactionAsync();
                return true;

            }catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }

        }

        public async Task<IEnumerable<UserResponse>> GetAllAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            if(users == null || !users.Any())
                return Enumerable.Empty<UserResponse>();
            return users.Select(UserMapper.ToResponse).ToList();
        }

        public async Task<AuthenticationResponse?> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                };
            }


            var user = await _unitOfWork.UserRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }

            var isValidPassword = await _unitOfWork.UserRepository.VerifyPasswordAsync(user, request.Password);
            if (!isValidPassword)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                };
            }
            if (user.IsActive != true || user.IsDeleted == true)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Account is inactive or deleted"
                };
            }

            var roleName = user.Role?.Name;
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "User role not found"
                };
            }

            var accessToken = _tokenProvider.GenerateAccessToken(user, roleName);
            var refreshToken = _tokenProvider.GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddMinutes(30);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = refreshToken;
            user.ExpiredRefreshToken = refreshTokenExpiry;
            var success = await _unitOfWork.UserRepository.UpdateAsync(user);
            if (success == 0)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Failed to update user refresh token"
                };
            }

            return new AuthenticationResponse
            {
                Success = true,
                Message = "Login successful",
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthenticationResponse?> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Refresh token is required"
                };
            }

            var user = await _unitOfWork.UserRepository.GetByRefreshTokenAsync(refreshToken);

            if (user == null)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Invalid refresh token"
                };
            }

            if (user.ExpiredRefreshToken == null || user.ExpiredRefreshToken < DateTime.UtcNow)
            {
                // Clear expired token
                user.RefreshToken = null;
                user.ExpiredRefreshToken = null;
                await _unitOfWork.UserRepository.UpdateAsync(user);

                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Refresh token has expired"
                };
            }

            if (user.IsActive != true || user.IsDeleted == true)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Account is inactive"
                };
            }

            var roleName = user.Role?.Name;
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "User role not found"
                };
            }

            var newAccessToken = _tokenProvider.GenerateAccessToken(user, roleName);
            var newRefreshToken = _tokenProvider.GenerateRefreshToken();
            var accessTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = newRefreshToken;
            user.ExpiredRefreshToken = refreshTokenExpiry;
            await _unitOfWork.UserRepository.UpdateAsync(user);

            return new AuthenticationResponse
            {
                Success = true,
                Message = "Token refreshed successfully",
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = accessTokenExpiry
            };

        }

        public Task<UserResponse> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetUserRoleAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserResponse> GetUserWithRoleAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public async Task<UserResponse?> GetByEmailAsync(string email)
        {
            var user = await _unitOfWork.UserRepository.GetByEmailAsync(email);
            return user == null ? null : UserMapper.ToResponse(user);
        }

        public async Task<UserResponse> UpdateAsync(UserUpdate user)
        {
            var userExist = await _unitOfWork.UserRepository.GetByIdAsync(user.Id);
            if (userExist == null)
                return new UserResponse
                {
                    Id = 0,
                    Email = "N/A",
                    Fullname = "No user data",
                    CreatedAt = null,
                    IsActive = false,
                    IsDeleted = false,
                    RoleId = null,
                    RoleName = "N/A"
                };
            userExist.Email = user.Email?.Trim();
            userExist.Fullname = user.Fullname?.Trim();
            userExist.RoleId = user.RoleId > 0 ? user.RoleId : null;
            userExist.IsActive = user.IsActive;

            var isUpdated = await _unitOfWork.UserRepository.UpdateUserAsync(userExist);
            if(!isUpdated)
            {
                throw new Exception("Failed to update user information");
            }
            return UserMapper.ToResponse(userExist);


        }

        public Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            throw new NotImplementedException();
        }

        public async Task RegisterAsync(UserRequest user)
        {
            var userExisted = await _unitOfWork.UserRepository.GetByEmailAsync(user.Email);
            if (userExisted != null)
            {
                throw new UserAlreadyExistsException(email: user.Email);
            }

            ValidatePassword(user.Password);

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var role = await _unitOfWork.RoleRepository.GetByIdAsync(user.RoleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }
            var newUser = UserMapper.ToEntity(user);

            await _unitOfWork.UserRepository.CreateAsync(newUser);

            await _unitOfWork.SaveAsync();
        }

        private void ValidatePassword(string password)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(password))
                errors.Add("Password cannot be empty.");

            if (password.Length < 8)
                errors.Add("Password must be at least 8 characters long.");

            if (!password.Any(char.IsUpper))
                errors.Add("Password must contain at least one uppercase letter.");

            if (!password.Any(char.IsLower))
                errors.Add("Password must contain at least one lowercase letter.");

            if (!password.Any(char.IsDigit))
                errors.Add("Password must contain at least one digit.");

            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                errors.Add("Password must contain at least one special character.");

            if (errors.Any())
                throw new WeakPasswordException(errors);
        }
    }
}
