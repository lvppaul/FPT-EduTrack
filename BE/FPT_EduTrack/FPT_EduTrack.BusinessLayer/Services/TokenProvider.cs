using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using System.Security.Claims;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class TokenProvider : ITokenProvider
    {
        public string GenerateAccessToken(User user, string roleName)
        {
            throw new NotImplementedException();
        }

        public string GenerateRefreshToken()
        {
            throw new NotImplementedException();
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            throw new NotImplementedException();
        }

        public bool ValidateToken(string token)
        {
            throw new NotImplementedException();
        }
    }
}
