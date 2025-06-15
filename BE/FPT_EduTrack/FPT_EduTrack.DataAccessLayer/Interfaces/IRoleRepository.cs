using FPT_EduTrack.DataAccessLayer.Entities;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IRoleRepository
    {
        public interface IRoleRepository
        {
            Task CreateAsync(Role role);
            Task<Role> GetByIdAsync(int id);
            Task<IEnumerable<Role>> GetAllAsync();
            Task UpdateAsync(Role role);
            Task DeleteAsync(Role role);
        }
    }
}
