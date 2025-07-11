using FPT_EduTrack.Api.Models;
using FPT_EduTrack.BusinessLayer.DTOs.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IEmailService
    {
       Task SendEmailAsync(EmailDto email);
    }
}
