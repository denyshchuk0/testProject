using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System.Collections.Generic;
using System.Linq;
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
        private readonly IOptions<AppSettings> appSettings;

        public UsersController(IUserService userService,
                               ICourseService courseService,
                               IMapper mapper,
                               IOptions<AppSettings> appSettings)
        {
            this.userService = userService;
            this.courseService = courseService;
            this.mapper = mapper;
            this.appSettings = appSettings;
        }

        [Authorize]
        [HttpGet("subscribe")]
        public IActionResult Subscribe(int coursId)
        {
            courseService.Subscribe(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), coursId);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpGet("all-users")]
        public IActionResult GetAllUsers(int page)
        {
            var users = userService.GetAllUsers(page);
            var count = appSettings.Value.allUsersCount;

            var model = mapper.Map<IList<UserModel>>(users);
            return Ok (new { model, count });
        }

        [HttpGet("all-courses")]
        public IActionResult GetAllCourses(int page)
        {
            var сourses = courseService.GetAllCourses(page);
            var count = appSettings.Value.allCoursesCount;
            var model = mapper.Map<IList<CourseModel>>(сourses);
            return Ok(new { model, count });
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
        public IActionResult Search(string searchParam, int page)
        {
            var users = userService.SearchUsers(searchParam, page);
            var count = appSettings.Value.allUsersCount;
            if (!string.IsNullOrEmpty(searchParam))
            {
                count = users.Count();
            }
            
            var model = mapper.Map<IList<UserModel>>(users);
            return Ok(new{ model, count });
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

