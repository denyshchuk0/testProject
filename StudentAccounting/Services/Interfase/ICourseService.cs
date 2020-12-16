using StudentAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
   public interface ICourseService
    {
        IEnumerable<Course> GetAllCourses();
        void RegisterToCourse(int userId, int coursId);
    }
}
