using Microsoft.Extensions.Options;
using MimeKit;
using StudentAccounting.Helpers;
using System;
using System.Net;
using System.Net.Mail;
using MailKit.Net.Smtp;
using System.Threading.Tasks;
using MailKit.Security;
using System.Diagnostics.Tracing;
using StudentAccounting.Services.Interfase;

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
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = string.Format("<h5 style='color:blue;'>{0}</h5>",message) }; ;

            using (var smtp = new MailKit.Net.Smtp.SmtpClient())
            {
                smtp.Connect(appSettings.SmtpHost, appSettings.SmtpPort, SecureSocketOptions.StartTls);
                smtp.Authenticate(appSettings.EmailFrom, appSettings.SmtpPassword);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
        }
        //public void SendEmailToUser(string emailId, string body)
        //{
        //    var fromMail = new MailAddress(appSettings.EmailFrom, appSettings.SmtpUser);
        //    var fromEmailPassword = appSettings.SmtpPassword;
        //    var toEmail = new MailAddress(emailId);

        //    var smtp = new SmtpClient();
        //    smtp.Host = appSettings.SmtpHost;
        //    smtp.Port = appSettings.SmtpPort;
        //    smtp.EnableSsl = true;
        //    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
        //    smtp.UseDefaultCredentials = false;
        //    smtp.Credentials = new NetworkCredential(fromMail.Address, fromEmailPassword);

        //    var Message = new MailMessage(fromMail, toEmail);
        //    Message.Subject = appSettings.MessageSubject;
        //    Message.Body = body;

        //    Message.IsBodyHtml = true;
        //    smtp.Send(Message);
        //}
    }
}
