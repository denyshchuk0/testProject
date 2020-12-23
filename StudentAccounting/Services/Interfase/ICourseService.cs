using StudentAccounting.Entities;
using System.Linq;

namespace StudentAccounting.Services.Interfase
{
    public interface ICourseService
    {
        IQueryable<Course> GetAllCourses();
        void Subscribe(int userId, int coursId);
    }
}
