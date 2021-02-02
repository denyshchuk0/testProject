using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NLog;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext context;
        private readonly IOptions<AppSettings> settings;
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public UserService(DataContext context, IOptions<AppSettings> settings)
        {
            this.context = context;
            this.settings = settings;
        }

        public IQueryable<User> GetAllUsers(PageListModel pageModel)
        {
            var users = context.Users.Include(x => x.Courses);
            settings.Value.allUsersCount = users.Count();

            var sortedUsers = ApplySorting(pageModel.sortOrder, pageModel.sortParameter, users);

            var items = Pagination(pageModel, sortedUsers).ToList();
            var courses = context.Course;
            foreach (var item in items)
            {
                foreach (var course in item.Courses)
                {
                    course.Course = courses.FirstOrDefault(x => x.Id == course.CourseId);
                }
            }
            return items.AsQueryable();
        }

        private static IQueryable<User> ApplySorting(string sortOrder, string sortParameter, IQueryable<User> users)
        {
            var type = typeof(User);
            var property = type.GetProperty(sortParameter);
            if (property != null)
            {
                var parameter = Expression.Parameter(type);
                var expression = Expression.Lambda<Func<User, object>>(
                    Expression.Convert(Expression.Property(parameter, property), typeof(object)),
                    parameter
                );

                if (sortOrder == "ascend")
                {
                    users = users.OrderBy(expression);
                }
                else if (sortOrder == "descend")
                {
                    users = users.OrderByDescending(expression);
                }
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
            var user = context.Users.FirstOrDefault(x=>x.Id==id);
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
                logger.Error("User not found");
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

        public IQueryable<User> SearchUsers(PageListModel pageModel, string serachParam)
        {
            if (string.IsNullOrEmpty(serachParam))
            {
                var users = GetAllUsers(pageModel).AsQueryable();
                return users;
            }

            IQueryable<User> students = context.Users.Where(s => s.FirstName.ToLower().Contains(serachParam.ToLower())
                || s.LastName.ToLower().Contains(serachParam.ToLower())
                || (s.FirstName + ' ' + s.LastName).ToLower().Contains(serachParam.ToLower())
                || (s.LastName + ' ' + s.FirstName).ToLower().Contains(serachParam.ToLower())
                || (s.Age).ToString().Contains(serachParam.ToLower())
                || (s.Email).ToLower().Contains(serachParam.ToLower())
                || s.FirstName.ToLower().StartsWith(serachParam.ToLower()));

            var items = Pagination(pageModel, students);
            return items;
        }

        private IQueryable<User> Pagination(PageListModel pageModel, IQueryable<User> students)
        {
            var items = students.Skip((pageModel.PageNumber - 1) * pageModel.PageSize)
                                .Take(pageModel.PageSize);

            return items.AsQueryable();
        }
    }
}
