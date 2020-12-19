using StudentAccounting.Entities;
using System.Linq;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers();
        User GetUserById(int id);
        void UpdateUser(User user, string password = null);
        void DeleteUser(int id);
    }
}
