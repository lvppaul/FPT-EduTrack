using FPT_EduTrack.Api.Models;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using RestSharp;
using System.Security.Claims;
using System.Security.Cryptography;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class TokenProvider : ITokenProvider
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiryMinutes;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public TokenProvider(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;

            _secretKey = configuration["JwtSettings:Key"] ?? throw new ArgumentNullException("JWT Key not configured");
            _issuer = configuration["JwtSettings:Issuer"] ?? throw new ArgumentNullException("JWT Issuer not configured");
            _audience = configuration["JwtSettings:Audience"] ?? throw new ArgumentNullException("JWT Audience not configured");
            _expiryMinutes = int.Parse(configuration["JwtSettings:ExpiryMinutes"] ?? "30");
        }
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
                    new Claim(JwtRegisteredClaimNames.Name, user.Fullname),
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

        public async Task<string> GetAccessTokenAsync(string email)
        {
            var user = await _unitOfWork.UserRepository.GetByEmailAsync(email);
            if (user == null)
                throw new Exception($"User with email {email} not found.");

            if (string.IsNullOrEmpty(user.Google_access_token) || string.IsNullOrEmpty(user.Google_refresh_token))
                throw new Exception("User has not connected their Google account.");

            if (user.GoogleAccessTokenExpiredAt <= DateTime.UtcNow)
            {
                var newToken = await RefreshTokenAsync(user.Google_refresh_token!);

                user.Google_access_token = newToken.access_token;
                user.GoogleAccessTokenExpiredAt = DateTime.UtcNow.AddSeconds(newToken.expires_in);
                await _unitOfWork.UserRepository.UpdateAsync(user);
            }

            return user.Google_access_token!;
        }

        private async Task<Token> RefreshTokenAsync(string refreshToken)
        {
            var restRequest = new RestRequest("https://oauth2.googleapis.com/token", Method.Post);
            restRequest.AddHeader("Content-Type", "application/x-www-form-urlencoded");

            restRequest.AddParameter("refresh_token", refreshToken);
            restRequest.AddParameter("client_id", _configuration["ClientId"]);
            restRequest.AddParameter("client_secret", _configuration["ClientSecret"]);
            restRequest.AddParameter("grant_type", "refresh_token");

            var response = await new RestClient().ExecuteAsync<Token>(restRequest);
            if (!response.IsSuccessful)
                throw new Exception("Failed to refresh token.");

            if (string.IsNullOrEmpty(response.Data?.refresh_token))
            {
                response.Data!.refresh_token = refreshToken;
            }

            return response.Data!;
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            throw new NotImplementedException();
        }

        public async Task<Token> GetTokenAsync(string code)
        {
            var restRequest = new RestRequest("https://oauth2.googleapis.com/token", Method.Post);
            restRequest.AddHeader("Content-Type", "application/x-www-form-urlencoded");

            restRequest.AddParameter("code", code);
            restRequest.AddParameter("client_id", _configuration["ClientId"]);
            restRequest.AddParameter("client_secret", _configuration["ClientSecret"]);
            restRequest.AddParameter("redirect_uri", _configuration["RedirectUrl"]);
            restRequest.AddParameter("grant_type", "authorization_code");

            var response = await new RestClient().ExecuteAsync<Token>(restRequest);
            if (!response.IsSuccessful)
                throw new Exception("Failed to get token from Google.");

            return response.Data!;
        }

        public bool ValidateToken(string token)
        {
            throw new NotImplementedException();
        }
    }
}
