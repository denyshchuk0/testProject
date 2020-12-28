using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System.Collections.Generic;
using System.Security.Claims;

namespace StudentAccounting.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly ICourseService courseService;
        private readonly IMapper mapper;

        public UsersController(IUserService userService,
                               ICourseService courseService,
                               IMapper mapper,
                               IOptions<AppSettings> appSettings,
                               IOptions<RegisterModelValidator> registerValidations,
                               IOptions<AuthenticateModelValidator> authenticateValidator)
        {
            this.userService = userService;
            this.courseService = courseService;
            this.mapper = mapper;
        }

        [Authorize]
        [HttpGet("subscription")]
        public IActionResult Subscription(int coursId)
        {
            courseService.Subscribe(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), coursId);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpGet("all-users")]
        public IActionResult GetAllUsers()
        {
            var users = userService.GetAllUsers();
            var model = mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }

        [HttpGet("all-courses")]
        public IActionResult GetAllCourses()
        {
            var сourses = courseService.GetAllCourses();
            var model = mapper.Map<IList<CourseModel>>(сourses);
            return Ok(model);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = userService.GetUserById(id);
            var model = mapper.Map<UserModel>(user.Result);
            return Ok(model);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("search")]
        public IActionResult Search(string searchParam)
        {
            var user = userService.SearchUsers(searchParam);
            var modelList = mapper.Map< IList <UserModel> >(user);
            return Ok(modelList);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("update-user/{id}")]
        public IActionResult Update(int id,[FromBody]UpdateModel model)
        {
            var user = mapper.Map<User>(model);
            user.Id = id;

            userService.UpdateUser(user);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-user/{id}")]
        public IActionResult DeleteUser(int id)
        {
            userService.DeleteUser(id);
            return Ok();
        }
    }
}

