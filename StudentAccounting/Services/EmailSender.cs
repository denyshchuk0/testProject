using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly AppSettings appSettings;
        public EmailSender(IOptions<AppSettings> appSettings)
        {
            this.appSettings = appSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(appSettings.EmailFrom);
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = string.Format("<h5 style='color:blue;'>{0}</h5>", message) }; ;

            using (var smtp = new MailKit.Net.Smtp.SmtpClient())
            {
                smtp.Connect(appSettings.SmtpHost, appSettings.SmtpPort, SecureSocketOptions.StartTls);
                smtp.Authenticate(appSettings.EmailFrom, appSettings.SmtpPassword);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
        }
    }
}
