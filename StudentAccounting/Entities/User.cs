using System;
using System.Collections.Generic;

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

        public ICollection<Сourse> Сourses { get; set; }
        public User()
        {
            Сourses = new List<Сourse>();
        }

    }
}
