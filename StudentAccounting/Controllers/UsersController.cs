﻿using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentAccounting.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
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

        //[AllowAnonymous]
        //[HttpGet("facebook-login")]
        //public IActionResult FacebookLogin(string returnUrl, string provider = "facebook")
        //{
        //    string authenticationScheme = string.Empty;
        //    authenticationScheme = FacebookDefaults.AuthenticationScheme;

        //    var auth = new AuthenticationProperties
        //    {
        //        RedirectUri = Url.Action(nameof(callback), new { provider, returnUrl })
        //    };

        //    return new ChallengeResult(authenticationScheme, auth);
        //}

        //[AllowAnonymous]
        //[Route("/[action]")]
        //public IActionResult callback(string returnUrl = null, string remoteError = null)
        //{
        //    var request = HttpContext.Request;
        //    return null;

        //}

        //[AllowAnonymous]
        //[HttpGet("facebook")]
        //public async Task<IActionResult> FacebookLoginAsync([FromBody] FacebookLoginResource resource)
        //{
        //    var authorizationTokens = await userService.FacebookLoginAsync(resource);
        //    return Ok(authorizationTokens);
        //}
        [AllowAnonymous]
        [HttpGet("subscription")]
        public IActionResult Subscription(int userId, int coursId)
        {
            courseService.RegisterToCourse(userId, coursId);
            return Ok();
        }

        [HttpGet]
        public IActionResult GetAllUserus()
        {
            var users = userService.GetAllUsers();
            var model = mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }
        [AllowAnonymous]
        [HttpPost("all-courses")]
        public IActionResult GetAllCourses()
        {
            var сourses = courseService.GetAllCourses();
            var model = mapper.Map<IList<CourseModel>>(сourses);
            return Ok(model);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = userService.GetUserById(id);
            var model = mapper.Map<UserModel>(user);
            return Ok(model);
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]UpdateModel model)
        {
            var user = mapper.Map<User>(model);
            user.Id = id;

            userService.UpdateUser(user, model.Password);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            userService.DeleteUser(id);
            return Ok();
        }
    }
}

