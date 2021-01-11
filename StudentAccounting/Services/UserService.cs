using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext context;
        private readonly IOptions<AppSettings> settings;

        public UserService(DataContext context, IOptions<AppSettings> settings)
        {
            this.context = context;
            this.settings = settings;
        }

        public IQueryable<User> GetAllUsers(int page)
        {
            int pageSize = settings.Value.pageUsersSize;
            IQueryable<User> users = context.Users;
            settings.Value.allUsersCount = users.Count();
            var items = users.Skip((page - 1) * pageSize).Take(pageSize);
            return items;
        }
        
        public async Task<User> GetUserById(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }

        public void DeleteUser(int id)
        {
            var user = context.Users.Find(id);
            if (user != null)
            {
                context.Users.Remove(user);
                context.SaveChanges();
            }
        }

        public void UpdateUser(User userParam)
        {
            var user = context.Users.FirstOrDefault(x=>x.Id==userParam.Id);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (!string.IsNullOrWhiteSpace(userParam.Email))
            {
                user.Email = userParam.Email;
                user.Age = userParam.Age;

                if (!string.IsNullOrWhiteSpace(userParam.FirstName))
                {
                    user.FirstName = userParam.FirstName;
                }

                if (!string.IsNullOrWhiteSpace(userParam.LastName))
                {
                    user.LastName = userParam.LastName;
                }
                context.Users.Update(user);
                context.SaveChanges();
            }
        }

        public IQueryable<User> GetAllSortedUsers() {
            return context.Users.OrderBy(x => x.FirstName);
        }

        public IQueryable<User> SearchUsers(string serachParam, int page)
        {
            if (!string.IsNullOrEmpty(serachParam))
            {
                IQueryable<User> students = context.Users.Where(s => s.FirstName.ToLower().Equals(serachParam.ToLower())
                || s.LastName.ToLower().Equals(serachParam.ToLower())
                || (s.FirstName + ' ' + s.LastName).ToLower().Equals(serachParam.ToLower())//
                || (s.LastName + ' ' + s.FirstName).ToLower().Equals(serachParam.ToLower())
                || s.FirstName.ToLower().StartsWith(serachParam.ToLower()));

                int pageSize = settings.Value.pageUsersSize;
                var items = students.Skip((page - 1) * pageSize).Take(pageSize);
                return items;
            }
            else if (string.IsNullOrEmpty(serachParam))
            {
                var items = GetAllUsers(page);

                return items;
            }
            else { return null; }  
        }
    }
}
