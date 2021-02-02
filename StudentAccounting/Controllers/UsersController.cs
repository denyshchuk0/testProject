using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System;
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
        public IActionResult Subscribe(int coursId, string startDate)
        {
            courseService.Subscribe(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), coursId, DateTime.Parse(startDate));
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpPost("all-users")]
        public IActionResult GetAllUsers([FromBody]PageListModel pageModel)
        {
            var users = userService.GetAllUsers(pageModel);

            var count = appSettings.Value.allUsersCount;
            var model = mapper.Map<IList<UserModel>>(users);
            return Ok(new { model, count });
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
        public IActionResult GetUserById(int id)
        {
            var user = userService.GetUserById(id);
            var model = mapper.Map<UserModel>(user.Result);
            return Ok(model);
        }

        [Authorize(Roles = "admin")]
        [HttpPost("search")]
        public IActionResult Search([FromBody]PageListModel pageModel, string searchParam)
        {
            var users = userService.SearchUsers(pageModel, searchParam);
            var count = appSettings.Value.allUsersCount;
            if (!string.IsNullOrEmpty(searchParam))
            {
                count = users.Count();
            }

            var model = mapper.Map<IList<UserModel>>(users);

            return Ok(new { model, count });
        }

        [Authorize(Roles = "admin")]
        [HttpPut("update-user/{id}")]
        public IActionResult Update([FromBody]UpdateModel model)
        {
            var user = mapper.Map<User>(model);
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

