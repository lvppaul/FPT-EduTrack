using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        public RoleRepository(FptEduTrackContext context) : base(context)
        {
        }
        public override async Task<Role> GetByIdAsync(int roleId)
        {
            return await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == roleId && r.IsDeleted != true);
        }
        public async Task<List<Role>> GetAllRolesAsync()
        {
            return await _context.Roles
                .Where(r => r.IsDeleted != true)
                .ToListAsync();
        }

        public Task DeleteAsync(Role role)
        {
            throw new NotImplementedException();
        }
    }
}
