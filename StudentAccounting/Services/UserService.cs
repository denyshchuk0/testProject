using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
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

        public IQueryable<User> GetAllUsers(int page, SortState sortOrder)
        {
            int pageSize = settings.Value.pageUsersSize;
            IQueryable<User> users = context.Users.Include(x=>x.Courses);
            switch (sortOrder)
            {
                case SortState.NameDesc:
                    users = users.OrderByDescending(s => s.FirstName);
                    break;
                case SortState.SurnameAsc:
                    users = users.OrderBy(s => s.LastName);
                    break;
                case SortState.SurnameDesc:
                    users = users.OrderByDescending(s => s.LastName);
                    break;
                case SortState.AgeAsc:
                    users = users.OrderBy(s => s.Age);
                    break;
                case SortState.AgeDesc:
                    users = users.OrderByDescending(s => s.Age);
                    break;
                case SortState.EmailAsc:
                    users = users.OrderBy(s => s.Email);
                    break;
                case SortState.EmailDesc:
                    users = users.OrderByDescending(s => s.Email);
                    break;
                case SortState.RegisteredDateAsc:
                    users = users.OrderBy(s => s.RegisteredDate);
                    break;
                case SortState.RegisteredDateDesc:
                    users = users.OrderByDescending(s => s.RegisteredDate);
                    break;
                case SortState.NameAsc:
                    break;
                default:
                    users = users.OrderBy(s => s.FirstName);
                    break;
            }

            var courses = context.Course.ToList();
            foreach (var model in users)
            {
                foreach (var course in model.Courses)
                {
                    course.Course = courses.FirstOrDefault(x => x.Id == course.CourseId);
                }
            }

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

        public IQueryable<User> SearchUsers(string serachParam, int page)
        {
            if (!string.IsNullOrEmpty(serachParam))
            {
                IQueryable<User> students = context.Users.Where(s => s.FirstName.ToLower().Contains(serachParam.ToLower())
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
                var items = GetAllUsers(page, SortState.RegisteredDateDesc);

                return items;
            }
            else { return null; }  
        }
    }
}
