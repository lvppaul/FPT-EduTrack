using FPT_EduTrack.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface ITokenService
    {
        Task<Token> GetTokenAsync(string code);
        Task<string> GetAccessTokenAsync(string email);
    }
}
