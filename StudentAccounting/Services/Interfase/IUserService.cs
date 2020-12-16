using StudentAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
        public interface IUserService
        {
            IEnumerable<User> GetAllUsers();           
            User GetUserById(int id);
            void UpdateUser(User user, string password = null);
            void DeleteUser(int id);
        }
}
