using StudentAccounting.Entities;
using StudentAccounting.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers(PageListModel pageModel);
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IQueryable<User> SearchUsers(PageListModel pageModel,string serachParam);
        void DeleteUser(int id);
    }
}
