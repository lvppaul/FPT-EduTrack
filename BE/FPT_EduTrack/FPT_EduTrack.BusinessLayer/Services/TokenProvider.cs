using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;


namespace FPT_EduTrack.BusinessLayer.Services
{
    public class TokenProvider(IConfiguration configuration) : ITokenProvider
    {
        private readonly string _secretKey = configuration["JwtSettings:Key"] ?? throw new ArgumentNullException("JWT Key not configured");
        private readonly string _issuer = configuration["JwtSettings:Issuer"] ?? throw new ArgumentNullException("JWT Issuer not configured");
        private readonly string _audience = configuration["JwtSettings:Audience"] ?? throw new ArgumentNullException("JWT Audience not configured");
        private readonly int _expiryMinutes = int.Parse(configuration["JwtSettings:ExpiryMinutes"] ?? "30");

        public string GenerateAccessToken(User user, string roleName)
        {
            var secretKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var email = user.Email;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, email),
                    new Claim("Role", roleName)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_expiryMinutes),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = signingCredentials
            };

            var handler = new JsonWebTokenHandler();
            //CreateToken trả về chuỗi đã được mã hóa ( dùng trong JsonWebTokenHandler mới hơn )
            //WriteToken sẽ trả về chuỗi token đã được mã hóa (dùng trong JwtSecurityTokenHandler )
            var token = handler.CreateToken(tokenDescriptor);
            return token;
        }

        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
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
