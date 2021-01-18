using Microsoft.Extensions.Options;
using NLog;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Services.Interfase;
using System;
using System.Linq;

namespace StudentAccounting.Services
{
    public class CourseService : ICourseService
    {
        private readonly DataContext context;
        private readonly INotificationEmailSender notificationEmailSender;
        private readonly IOptions<AppSettings> settings;

        public CourseService(DataContext context, INotificationEmailSender notificationEmailSender, IOptions<AppSettings> settings)
        {
            this.context = context;
            this.notificationEmailSender = notificationEmailSender;
            this.settings = settings;
        }

        public void Subscribe(int userId, int coursId, DateTime startDate)
        {
            var user = context.Users.FirstOrDefault(x => x.Id == userId);
            var course = context.Course.FirstOrDefault(x => x.Id == coursId);
            var subcription = new Subscription { User = user, Course = course, StartDate = startDate };

            user.Courses.Add(course);
            context.Users.Update(user);
            context.Subscriptions.Update(subcription);
            context.SaveChanges();

            notificationEmailSender.ScheduleJobs(user.Email, course.Name, subcription.StartDate);
        }
        public IQueryable<Course> GetAllCourses(int page)
        {
            int pageSize = settings.Value.pageCoursesSize;
            IQueryable<Course> courses = context.Course;
            settings.Value.allCoursesCount = courses.Count();
            var items = courses.Skip((page - 1) * pageSize).Take(pageSize);
            return items;
        }
    }
}
