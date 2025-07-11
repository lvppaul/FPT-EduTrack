using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.DTOs.Request;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(EmailDto emailDto)
        {
            var message = new MimeMessage();

            // From
            message.From.Add(MailboxAddress.Parse(_configuration["EmailSettings:From"]));

            // To: Gửi đến nhiều người
            foreach (var address in emailDto.To)
            {
                message.To.Add(MailboxAddress.Parse(address));
            }

            // Subject & Body
            message.Subject = emailDto.Subject;
            message.Body = new TextPart("html") { Text = emailDto.Body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                _configuration["EmailSettings:SmtpServer"],
                int.Parse(_configuration["EmailSettings:Port"]),
                true
            );
            await smtp.AuthenticateAsync(
                _configuration["EmailSettings:Username"],
                _configuration["EmailSettings:Password"]
            );
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

    }
}
