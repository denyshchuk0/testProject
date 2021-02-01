using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using RazorClassLibrary.Services;
using RazorClassLibrary.Views.Emails.ConfirmAccount;
using RazorClassLibrary.Views.Emails.NontificationEmails;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly AppSettings appSettings;
        private readonly IRazorViewToStringRenderer razorViewToStringRenderer;

        public EmailSender(IOptions<AppSettings> appSettings, IRazorViewToStringRenderer razorViewToStringRenderer)
        {
            this.razorViewToStringRenderer = razorViewToStringRenderer;
            this.appSettings = appSettings.Value;
        }

        public async Task SendConfirmEmail(string email, string baseUrl)
        {
            var confirmAccountModel = new ConfirmAccountEmailViewModel($"{baseUrl}");

            string body = await razorViewToStringRenderer
                                .RenderViewToStringAsync(
                                 "~/Views/Emails/ConfirmAccount/ConfirmAccount.cshtml",
                                 confirmAccountModel);

            SendEmailAsync(email, "Confirm your Account", body);
        }

        public async Task SendNotificationEmail(string email, string subject, string message)
        {
            var scheduleEmailModel = new ScheduleEmailViewModel(message);

            string body = await razorViewToStringRenderer
                                .RenderViewToStringAsync(
                                 "~/Views/Emails/NontificationEmails/ScheduleEmail.cshtml",
                                 scheduleEmailModel);

            SendEmailAsync(email, subject, body);
        }


        public async void SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(appSettings.EmailFrom);
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

            using (var smtp = new MailKit.Net.Smtp.SmtpClient())
            {
                smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;

                smtp.Connect(appSettings.SmtpHost, appSettings.SmtpPort, SecureSocketOptions.StartTls);
                smtp.Authenticate(appSettings.EmailFrom, appSettings.SmtpPassword);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
        }
    }
}
