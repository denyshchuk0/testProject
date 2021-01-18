using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Entities
{
    public class Subscription
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public User User { get; set; }
        public Course Course { get; set; }
    }
}
