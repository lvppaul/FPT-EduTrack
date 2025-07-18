using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.BusinessLayer.Exceptions;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
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

            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }

        }

        public async Task<IEnumerable<UserResponse>> GetAllAsync()
        {
            var users = await _unitOfWork.UserRepository.GetAllAsync();
            if (users == null || !users.Any())
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
                    Message = "User does not exist! Please check your email and try later."
                };
            }
                                    
            var isValidPassword = await _unitOfWork.UserRepository.VerifyPasswordAsync(user, request.Password);
            if (!isValidPassword)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Invalid password! Please check your password and try later."
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
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthenticationResponse?> RefreshTokenAsync(string refreshToken)
        {
            //refreshtoken trống
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Refresh token is required"
                };
            }

            var user = await _unitOfWork.UserRepository.GetByRefreshTokenAsync(refreshToken);

            // ko tìm thấy user có refreshtoken nhập vào
            if (user == null)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Invalid refresh token"
                };
            }

            // Kiểm tra xem refresh token đã hết hạn chưa
            // nếu hết hạn thì xóa token
            // và trả về thông báo hết hạn

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

            // Kiểm tra xem tài khoản có bị xóa hay không hoạt động không
            if (user.IsActive != true || user.IsDeleted == true)
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "Account is inactive"
                };
            }

            //Kiểm tra role của user
            var roleName = user.Role?.Name;
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return new AuthenticationResponse
                {
                    Success = false,
                    Message = "User role not found"
                };
            }

            // nếu chưa hết hạn thì tạo access token mới
            var newAccessToken = _tokenProvider.GenerateAccessToken(user, roleName);
            var newRefreshToken = _tokenProvider.GenerateRefreshToken();
            //var accessTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            user.RefreshToken = newRefreshToken;
            user.ExpiredRefreshToken = refreshTokenExpiry;
            await _unitOfWork.UserRepository.UpdateAsync(user);

            return new AuthenticationResponse
            {
                Success = true,
                Message = "Token refreshed successfully",
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
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

            var isUpdated = await _unitOfWork.UserRepository.UpdateAsync(userExist);
            if (isUpdated == 0)
            {
                throw new Exception("Failed to update user information");
            }
            return UserMapper.ToResponse(userExist);


        }

        public Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            throw new NotImplementedException();
        }

        public async Task<User> RegisterAsync(UserRequest user)
        {
            var userExisted = await _unitOfWork.UserRepository.GetByEmailAsync(user.Email);
            if (userExisted != null)
            {
                throw new UserAlreadyExistsException(email: user.Email);
            }

            ValidatePassword(user.Password);

            if (!user.Password.Equals(user.ConfirmPassword))
            {
                throw new Exception("Password and confirm password does not match");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var role = await _unitOfWork.RoleRepository.GetByIdAsync(user.RoleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }
            var newUser = UserMapper.ToEntity(user);

            await _unitOfWork.UserRepository.CreateAsync(newUser);

            return newUser;
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

        public async Task SaveGoogleTokenAsync(string email, string accessToken, string refreshToken, DateTime accessTokenExpiredAt)
        {
            var user = await _unitOfWork.UserRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new Exception($"User with {email} does not exist.");
            }
            user.Google_access_token = accessToken;
            user.Google_refresh_token = refreshToken;
            user.GoogleAccessTokenExpiredAt = accessTokenExpiredAt;
            await _unitOfWork.UserRepository.UpdateAsync(user);
        }
    }
}
