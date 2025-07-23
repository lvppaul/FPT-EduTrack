using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(FptEduTrackContext context) : base(context)
        {
        }


        public async Task DeleteAsync(User user)
        {
            user.IsDeleted = !user.IsDeleted;
            await UpdateAsync(user);
        }

        public async Task SetActive(User user)
        {
            user.IsActive = !user.IsActive;
            await UpdateAsync(user);
        }

        public override async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.IsDeleted == false)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public override async Task<List<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.IsDeleted == false)
                .ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            return await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.IsDeleted != true);
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return null;

            return await _context.Users
       .Include(u => u.Role)
       .FirstOrDefaultAsync(u =>
           u.RefreshToken == refreshToken &&
           u.IsActive == true &&
           u.IsDeleted == false);

        }

        public async Task<bool> VerifyPasswordAsync(User user, string password)
        {
            return await Task.FromResult(BCrypt.Net.BCrypt.Verify(password, user.Password));
        }

        public async Task<List<User>> GetAllAsyncWithPagination(Pagination pagination)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.IsDeleted == false)
                .Skip((pagination.PageNumber - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();
        }
     
    }
}
