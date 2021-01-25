using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IEmailSender
    {
        Task SendConfirmEmail(string email, string baseUrl);
        Task SendNotificationEmail(string email, string subject, string message);
        void SendEmailAsync(string email, string subject, string message);
    }
}
