using StudentAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Models
{
    public class UsersCoursesModel
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public DateTime StartDate { get; set; }
    }
}
