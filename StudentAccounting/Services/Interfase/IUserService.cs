using StudentAccounting.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers(int page);
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IQueryable<User> SearchUsers(string serachParam, int page);
        void DeleteUser(int id);
    }
}
