using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.DTOs.Update;
using FPT_EduTrack.DataAccessLayer.Entities;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class UserMapper
    {
        #region Entity to DTO

        public static UserResponse ToResponse(this User user)
        {
            if (user == null) return null;

            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Fullname = user.Fullname ?? string.Empty,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive ?? false,
                IsDeleted = user.IsDeleted ?? false,
                RoleId = user.RoleId,
                RoleName = user.Role?.Name ?? string.Empty
            };
        }
        public static List<UserResponse> ToDtoList(this IEnumerable<User> users)
        {
            return users?.Select(u => u.ToResponse()).ToList() ?? new List<UserResponse>();
        }

        #endregion

        #region Request to Entity
        public static User ToEntity(this UserRequest request)
        {
            if (request == null) return null;

            return new User
            {
                Email = request.Email?.Trim(),
                // Password = BCrypt.HashPassword(request.Password), // Hash password
                Password = request.Password,
                Fullname = request.Fullname?.Trim(),
                RoleId = request.RoleId,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };
        }

        public static void ToUpdate(this UserUpdate request, User user)
        {
            if (request == null || user == null) return;

            user.Email = request.Email?.Trim();
            user.Fullname = request.Fullname?.Trim();

            if (request.RoleId.HasValue)
                user.RoleId = request.RoleId;

            if (request.IsActive.HasValue)
                user.IsActive = request.IsActive;
        }

        #endregion


    }
}
