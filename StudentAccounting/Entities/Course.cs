﻿using System;
using System.Collections.Generic;

namespace StudentAccounting.Entities
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte[] Photo { get; set; }

        public virtual ICollection<User> Users { get; set; }
        public virtual ICollection<Subscription> Subscriptions{ get; set; }
        public Course()
        {
            Users = new List<User>();
            Subscriptions = new List<Subscription>();
        }
    }
}
