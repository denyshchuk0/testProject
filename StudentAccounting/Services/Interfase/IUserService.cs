﻿using StudentAccounting.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IUserService
    {
        IQueryable<User> GetAllUsers();
        Task<User> GetUserById(int id);
        void UpdateUser(User user);
        IQueryable<User> SearchUsers(string serachParam);
        void DeleteUser(int id);
    }
}
