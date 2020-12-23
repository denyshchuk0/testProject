using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System;
using System.Linq;

namespace StudentAccounting.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext context;

        public UserService(DataContext context)
        {
            this.context = context;
        }

        public IQueryable<User> GetAllUsers()
        {
            return context.Users;
        }
        
        public User GetUserById(int id)
        {
            return context.Users.Find(id);
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


        public IQueryable<User> SearchUsers(string serachParam)
        {
        
            if (!string.IsNullOrEmpty(serachParam)) {

                var students = context.Users.Where(s => s.FirstName.ToLower().Equals(serachParam.ToLower())
                || s.LastName.ToLower().Equals(serachParam.ToLower())
                || (s.FirstName + ' ' + s.LastName).ToLower().Equals(serachParam.ToLower())
                || (s.LastName + ' ' + s.FirstName).ToLower().Equals(serachParam.ToLower())
                || s.FirstName.ToLower().StartsWith(serachParam.ToLower()));

            return students; }
            else {
                return null;
            }   
        }
    }
}
