using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System.Linq;

namespace StudentAccounting.Services
{
    public class CourseService : ICourseService
    {
        private readonly DataContext context;
        private readonly INotificationEmailSender notificationEmailSender;

        public CourseService(DataContext context, INotificationEmailSender notificationEmailSender)
        {
            this.context = context;
            this.notificationEmailSender = notificationEmailSender;
        }

        public void RegisterToCourse(int userId, int coursId)
        {
            var user = context.Users.FirstOrDefault(x => x.Id == userId);
            var course = context.Course.FirstOrDefault(x => x.Id == coursId);
            user.Courses.Add(course);
            context.Users.Update(user);
            context.SaveChanges();

            notificationEmailSender.SendNotificationEmails(user.Email, course.Name, course.StartDate);

        }
        public IQueryable<Course> GetAllCourses()
        {
            return context.Course;
        }

    }
}
