using StudentAccounting.Entities;
using System.Linq;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers();
        User GetUserById(int id);
        void UpdateUser(User user);
        IQueryable<User> SearchUsers(string serachParam);
        void DeleteUser(int id);
    }
}
