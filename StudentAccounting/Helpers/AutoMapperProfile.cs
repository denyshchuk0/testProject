using AutoMapper;
using StudentAccounting.Entities;
using StudentAccounting.Models;

namespace StudentAccounting.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<RegisterModel, User>();
            CreateMap<UpdateModel, User>();
            CreateMap<FacebookAccount, AuthenticateModel>();
            CreateMap<FacebookAccount, RegisterModel>();
            CreateMap<Course, CourseModel>();   
        }
    }
}
