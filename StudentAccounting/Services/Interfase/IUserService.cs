using StudentAccounting.Entities;
using StudentAccounting.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers(int page, SortState sortOrder);
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IQueryable<User> SearchUsers(string serachParam, int page);
        void DeleteUser(int id);
    }
}
