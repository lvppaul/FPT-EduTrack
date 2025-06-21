using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.Api.Models;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class TokenService : ITokenService
    {
        private readonly IRestClient restClient;
        private readonly IConfiguration configuration;
        private readonly IUnitOfWork _unitOfWork;

        public TokenService(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            this.restClient = new RestClient("https://oauth2.googleapis.com/token");
            this.configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        // Lấy token lần đầu bằng mã code
        public async Task<Token> GetTokenAsync(string code)
        {
            var restRequest = new RestRequest("https://oauth2.googleapis.com/token", Method.Post);
            restRequest.AddHeader("Content-Type", "application/x-www-form-urlencoded");

            restRequest.AddParameter("code", code);
            restRequest.AddParameter("client_id", configuration["ClientId"]);
            restRequest.AddParameter("client_secret", configuration["ClientSecret"]);
            restRequest.AddParameter("redirect_uri", configuration["RedirectUrl"]);
            restRequest.AddParameter("grant_type", "authorization_code");

            var response = await new RestClient().ExecuteAsync<Token>(restRequest);
            if (!response.IsSuccessful)
                throw new Exception("Failed to get token from Google.");

            return response.Data!;
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
            restRequest.AddParameter("client_id", configuration["ClientId"]);
            restRequest.AddParameter("client_secret", configuration["ClientSecret"]);
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
    }
}
