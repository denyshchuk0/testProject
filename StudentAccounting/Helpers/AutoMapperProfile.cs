using AutoMapper;
using StudentAccounting.Entities;
using StudentAccounting.Models;

namespace StudentAccounting.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>().ForMember(x => x.Courses, s => s.MapFrom(x => x.Courses));
            CreateMap<RegisterModel, User>();
            CreateMap<UpdateModel, User>();
            CreateMap<FacebookAccount, AuthenticateModel>();
            CreateMap<FacebookAccount, RegisterModel>();
            CreateMap<Course, CourseModel>();   
            CreateMap<UsersCourses, UsersCoursesModel>().ForMember(x => x.Id , s => s.MapFrom(x => x.CourseId));
        }
    }
}
