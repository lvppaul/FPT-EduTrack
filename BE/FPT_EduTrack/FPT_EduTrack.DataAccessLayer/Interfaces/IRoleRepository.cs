using FPT_EduTrack.DataAccessLayer.Entities;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IRoleRepository : IGenericRepository<Role>
    {
        Task DeleteAsync(Role role);
       
    }
}
