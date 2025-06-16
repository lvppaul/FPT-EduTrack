using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IUserService
    {
        Task<AuthenticationResponse?> LoginAsync(LoginRequest request);
        Task<AuthenticationResponse?> RefreshTokenAsync(string refreshToken);
        Task<UserResponse> CreateAsync(UserRequest user);
        Task<UserResponse> GetByIdAsync(int id);
        Task<IEnumerable<UserResponse>> GetAllAsync();
        Task<UserResponse> UpdateAsync(UserUpdate user);
        Task DeleteAsync(int userId);
        Task<UserResponse?> GetByEmailAsync(string email);
        Task<string> GetUserRoleAsync(int userId);
        Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry);
        Task<UserResponse> GetUserWithRoleAsync(int userId);
    }
}
