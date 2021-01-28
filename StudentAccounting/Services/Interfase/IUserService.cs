using StudentAccounting.Entities;
using StudentAccounting.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IEnumerable<User> GetAllUsers(int page, string sortOrder,string sortParameter);
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IEnumerable<User> SearchUsers(string serachParam, int page);
        void DeleteUser(int id);
    }
}
