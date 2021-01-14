using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Entities
{
    public class CourseUser
    {
        public int CoursesId { get; set; }
        public int UsersId { get; set; }
        public virtual Course Course { get; set; }
        public virtual User User { get; set; }
        public DateTime StartDate { get; set; }
    }
}
