using System;
using System.Collections.Generic;

namespace StudentAccounting.Entities
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public byte[] Photo { get; set; }

        public ICollection<User> Users { get; set; }
        public Course()
        {
            Users = new List<User>();
        }
    }
}
