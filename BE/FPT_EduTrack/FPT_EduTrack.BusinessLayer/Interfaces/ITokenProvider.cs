using FPT_EduTrack.Api.Models;
using FPT_EduTrack.DataAccessLayer.Entities;
using System.Security.Claims;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface ITokenProvider
    {
        string GenerateAccessToken(User user, string roleName);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        bool ValidateToken(string token);
        Task<Token> GetTokenAsync(string code);
        Task<string> GetAccessTokenAsync(string email);
    }
}
