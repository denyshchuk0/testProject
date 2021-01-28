using StudentAccounting.Entities;
using StudentAccounting.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IEnumerable<User> GetAllUsers(PageListModel pageModel);
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IEnumerable<User> SearchUsers(PageListModel pageModel,string serachParam);
        void DeleteUser(int id);
    }
}
