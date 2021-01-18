﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentAccounting.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public DateTime RegisteredDate { get; set; }
        public bool isVerificated { get; set; }
        public string VerificationToken { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public int RoleId { get; set; }

        public virtual Role Role { get; set; }

        public virtual ICollection<Course> Courses { get; set; }
        public virtual ICollection<Subscription> Subscriptions { get; set; }
        public User()
        {
            Courses = new List<Course>();
            Subscriptions = new List<Subscription>();
        }
    }
}
