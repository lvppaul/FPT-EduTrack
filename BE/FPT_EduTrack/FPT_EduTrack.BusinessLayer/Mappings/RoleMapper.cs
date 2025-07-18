using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Mappings
{
    public static class RoleMapper
    {
        public static RoleResponse ToResponse(this Role role)
        {
            if (role == null) return null;
            return new RoleResponse
            {
              Id = role.Id,
                Name = role.Name?.Trim(),
            };
        }
    }
}
