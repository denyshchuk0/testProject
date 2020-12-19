using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System.Collections.Generic;
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

        public void UpdateUser(User userParam, string password = null)
        {
            var user = context.Users.Find(userParam.Id);

            if (user == null)
            {
                //throw new AppException("User not found");
            }

            if (!string.IsNullOrWhiteSpace(userParam.Email) && userParam.Email.ToUpper() != user.Email.ToUpper())
            {
                if (context.Users.Any(x => x.Email.ToUpper() == userParam.Email.ToUpper()))
                {
                   // throw new AppException("Username " + userParam.Email + " is already taken");
                }

                user.Email = userParam.Email;

                if (!string.IsNullOrWhiteSpace(userParam.FirstName))
                {
                    user.FirstName = userParam.FirstName;
                }

                if (!string.IsNullOrWhiteSpace(userParam.LastName))
                {
                    user.LastName = userParam.LastName;
                }

                //if (!string.IsNullOrWhiteSpace(password))
                //{
                //    byte[] passwordHash, passwordSalt;
                //    CreatePasswordHash(password, out passwordHash, out passwordSalt);

                //    user.PasswordHash = passwordHash;
                //    user.PasswordSalt = passwordSalt;
                //}
                context.Users.Update(user);
                context.SaveChanges();
            }
        }

    }
}
