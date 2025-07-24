using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task DeleteAsync(User user);
        Task SetActive(User user);
        Task<User?> GetByEmailAsync(string email);
        Task<bool> VerifyPasswordAsync(User user, string password);
        Task<User?> GetByRefreshTokenAsync(string refreshToken);
        Task<List<User>> GetAllAsyncWithPagination(Pagination pagination);
        Task<List<User>> GetAllAsync();

        Task<List<User>> GetAllLecturersAsync();
        Task<List<User>> GetAllStudentsAsync();

    }
}
