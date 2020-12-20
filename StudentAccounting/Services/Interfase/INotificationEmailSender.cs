﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public interface INotificationEmailSender
    {
         void SendNotificationEmails(string email, string courseName, DateTime startDate);
    }
}
