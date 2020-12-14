using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Entities
{
    public class Сourse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public byte[] Photo { get; set; }
       
        public ICollection<User> Users { get; set; }
        public Сourse()
        {
            Users = new List<User>();
        }
    }
}
