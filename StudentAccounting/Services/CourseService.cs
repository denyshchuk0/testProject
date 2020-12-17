using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class CourseService : ICourseService
    {
        private readonly DataContext context;

        public CourseService(DataContext context)
        {
            this.context = context;
        }

        public void RegisterToCourse(int userId, int coursId)
        {
            var user = context.Users.SingleOrDefault(x => x.Id == userId);
            var cours = context.Course.SingleOrDefault(x => x.Id == coursId);
            user.Courses.Add(cours);
            context.Users.Update(user);
            context.SaveChanges();
        }
        public IEnumerable<Course> GetAllCourses()
        {
            return context.Course;
        }

    }
}
