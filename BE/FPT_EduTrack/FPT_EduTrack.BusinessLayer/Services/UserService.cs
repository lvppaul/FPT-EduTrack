using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;

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

        public Task DeleteAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<UserResponse>> GetAllAsync()
        {
            throw new NotImplementedException();
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

        public Task<UserResponse> UpdateAsync(UserUpdate user)
        {
            throw new NotImplementedException();
        }

        public Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            throw new NotImplementedException();
        }
    }
}
