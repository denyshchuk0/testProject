using System;
using System.Collections.Generic;

namespace StudentAccounting.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public DateTime RegisteredDate { get; set; }
        public bool isVerificated { get; set; }
        public string VerificationToken { get; set; }
        public List<UsersCoursesModel> Courses { get; set; }
    }
}
