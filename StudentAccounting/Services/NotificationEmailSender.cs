using Hangfire;
using StudentAccounting.Services.Interfase;
using System;

namespace StudentAccounting.Services
{
    public class NotificationEmailSender : INotificationEmailSender
    {
        private readonly IEmailSender emailSender;

        public NotificationEmailSender(IEmailSender emailSender)
        {
            this.emailSender = emailSender;
        }

        public void SendNotificationEmails(string email, string courseName, DateTime startDate)
        {
            var monthNotify = startDate.AddMonths(1);
            var weekNotify = startDate.AddDays(7);
            var dayNotify = startDate.AddHours(-1);

            if (DateTime.Now < monthNotify)
            {
                BackgroundJob.Schedule(() =>
                emailSender.SendEmailAsync(email, "Montly Course start", $"Your course {courseName} will start at {startDate}"), monthNotify);
            }
            if (DateTime.Now < weekNotify)
            {
                BackgroundJob.Schedule(() =>
                emailSender.SendEmailAsync(email, "Weekly Course notification", $"Your course {courseName} will start at {startDate}"), weekNotify);
            }
            if (DateTime.Now < dayNotify)
            {
                BackgroundJob.Schedule(() =>
                emailSender.SendEmailAsync(email, "Daily Course notification", $"Your course {courseName} will start at {startDate}"), startDate);
            }
            BackgroundJob.Schedule(() =>
                emailSender.SendEmailAsync(email, "Subscribed Course notification", $"Your course {courseName} will start at {startDate}"), DateTime.Now);
        }
    }
}
