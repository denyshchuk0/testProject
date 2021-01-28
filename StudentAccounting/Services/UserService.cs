using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
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

        public IEnumerable<User> GetAllUsers(int page, string sortOrder, string sortParameter)
        {
            int pageSize = settings.Value.pageUsersSize;

            var users = context.Users.Include(x => x.Courses).ToList();

            users = ApplySorting(sortOrder, sortParameter, users);

            var courses = context.Course.ToList();
            foreach (var item in users)
            {
                foreach (var course in item.Courses)
                {
                    course.Course = courses.FirstOrDefault(x => x.Id == course.CourseId);
                }
            }

            settings.Value.allUsersCount = users.ToList().Count();
            var items = users.Skip((page - 1) * pageSize).Take(pageSize);
            return items;
        }

        private static List<User> ApplySorting(string sortOrder, string sortParameter, List<User> users)
        {
            if (sortOrder == "ascend")
            {
                users = users.OrderBy(s => s.GetType().GetProperty(sortParameter).GetValue(s)).ToList();
            }
            else if (sortOrder == "descend")
            {
                users = users.OrderByDescending(s => s.GetType().GetProperty(sortParameter).GetValue(s)).ToList();
            }
            return users;
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
            var user = context.Users.FirstOrDefault(x => x.Id == userParam.Id);

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

        public IEnumerable<User> SearchUsers(string serachParam, int page)
        {
            if (!string.IsNullOrEmpty(serachParam))
            {
                IEnumerable<User> students = context.Users.Where(s => s.FirstName.ToLower().Contains(serachParam.ToLower())
                || s.LastName.ToLower().Contains(serachParam.ToLower())
                || (s.FirstName + ' ' + s.LastName).ToLower().Contains(serachParam.ToLower())
                || (s.LastName + ' ' + s.FirstName).ToLower().Contains(serachParam.ToLower())
                || s.FirstName.ToLower().StartsWith(serachParam.ToLower()));

                int pageSize = settings.Value.pageUsersSize;
                var items = students.Skip((page - 1) * pageSize).Take(pageSize);
                return items;
            }
            else if (string.IsNullOrEmpty(serachParam))
            {
                var items = GetAllUsers(page, null, null);

                return items;
            }
            else { return null; }
        }
    }
}
