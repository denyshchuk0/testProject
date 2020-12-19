using StudentAccounting.Entities;
using System.Linq;

namespace StudentAccounting.Services.Interfase
{
    public interface ICourseService
    {
        IQueryable<Course> GetAllCourses();
        void RegisterToCourse(int userId, int coursId);
    }
}
