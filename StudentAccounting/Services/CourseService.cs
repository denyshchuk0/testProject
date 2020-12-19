using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System.Linq;

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
            var user = context.Users.FirstOrDefault(x => x.Id == userId);
            var cours = context.Course.FirstOrDefault(x => x.Id == coursId);
            user.Courses.Add(cours);
            context.Users.Update(user);
            context.SaveChanges();
        }
        public IQueryable<Course> GetAllCourses()
        {
            return context.Course;
        }

    }
}
