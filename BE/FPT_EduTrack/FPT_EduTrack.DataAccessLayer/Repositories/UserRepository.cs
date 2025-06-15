using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly FptEduTrackContext _context;
        public UserRepository(FptEduTrackContext context)
        {
            _context = context;
        }
        public Task DeleteAsync(User user)
        {
            throw new NotImplementedException();
        }

        Task IUserRepository.CreateAsync(User user)
        {
            return CreateAsync(user);
        }

        Task<IEnumerable<User>> IUserRepository.GetAllAsync()
        {
            throw new NotImplementedException();
        }

        Task IUserRepository.UpdateAsync(User user)
        {
            return UpdateAsync(user);
        }
    }
}
