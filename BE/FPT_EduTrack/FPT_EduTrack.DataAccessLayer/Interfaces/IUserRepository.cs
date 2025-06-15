using FPT_EduTrack.DataAccessLayer.Entities;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IUserRepository
    {
        Task CreateAsync(User user);
        Task<User> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);

    }
}
