﻿using StudentAccounting.Entities;
using System;
using System.Linq;

namespace StudentAccounting.Services.Interfase
{
    public interface ICourseService
    {
        IQueryable<Course> GetAllCourses(int page);
        void Subscribe(int userId, int coursId, DateTime startDate);
    }
}
