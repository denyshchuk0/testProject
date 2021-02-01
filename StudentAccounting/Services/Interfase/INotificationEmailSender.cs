using System;

namespace StudentAccounting.Services
{
    public interface INotificationEmailSender
    {
        void ScheduleJobs(string email, string courseName, DateTime startDate);
    }
}
