using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IUserService
    {
        Task<AuthenticationResponse?> LoginAsync(LoginRequest request);
        Task<AuthenticationResponse?> RefreshTokenAsync(string refreshToken);
        Task<UserResponse> GetByIdAsync(int id);
        Task<IEnumerable<UserResponse>> GetAllAsync();
        Task<IEnumerable<UserResponse>> GetAllAsyncWithPagination(Pagination pagination);
        Task<UserResponse> UpdateAsync(UserUpdate user);
        Task<bool> DeleteAsync(int userId);
        Task<UserResponse?> GetByEmailAsync(string email);
        Task<string> GetUserRoleAsync(int userId);
        Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry);
        Task<UserResponse> GetUserWithRoleAsync(int userId);
        Task<User> RegisterAsync(UserRequest user);
        Task SaveGoogleTokenAsync(string email, string accessToken, string refreshToken, DateTime accessTokenExpiredAt);

    }
}
