using AutoMapper;
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
        private readonly IMapper mapper;
        private readonly AppSettings appSettings;
        private readonly RegisterModelValidator registerValidations;
        private readonly AuthenticateModelValidator authenticateValidator;

        public UsersController(IUserService userService,
                               IMapper mapper,
                               IOptions<AppSettings> appSettings,
                               IOptions<RegisterModelValidator> registerValidations,
                               IOptions<AuthenticateModelValidator> authenticateValidator)
        {
            this.userService = userService;
            this.mapper = mapper;
            this.appSettings = appSettings.Value;
            this.registerValidations = registerValidations.Value;
            this.authenticateValidator = authenticateValidator.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            authenticateValidator.Validate(model);
            var user = userService.Authenticate(model);
            if (user == null)
            {
                return NotFound(new { message = "User not found!" });
            }
            if (!user.isVerificated)
            {
                return BadRequest(new { message = "Email is not confirmed" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpGet("facebook-login")]
        public IActionResult FacebookLogin(string returnUrl, string provider = "facebook")
        {
            string authenticationScheme = string.Empty;
            authenticationScheme = FacebookDefaults.AuthenticationScheme;

            var auth = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(callback), new { provider, returnUrl })
            };

            return new ChallengeResult(authenticationScheme, auth);
        }

        [AllowAnonymous]
        [Route("/[action]")]
        public IActionResult callback(string returnUrl = null, string remoteError = null)
        {
            var request = HttpContext.Request;
            return null;

        }

        //[AllowAnonymous]
        //[HttpGet("facebook")]
        //public async Task<IActionResult> FacebookLoginAsync([FromBody] FacebookLoginResource resource)
        //{
        //    var authorizationTokens = await userService.FacebookLoginAsync(resource);
        //    return Ok(authorizationTokens);
        //}


        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            registerValidations.Validate(model);
            var user = mapper.Map<User>(model);
            userService.Create(user, model.Password);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("verify-email")]
        public IActionResult VerifyEmail(string token)
        {
            userService.VerifyEmail(token);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("subscription")]
        public IActionResult Subscription(int userId, int coursId)
        {
            userService.CreateUsersCourse(userId, coursId);

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
            var сourses = userService.GetAllCourses();
            var model = mapper.Map<IList<CourseModel>>(сourses);
            return Ok(model);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = userService.GetById(id);
            var model = mapper.Map<UserModel>(user);
            return Ok(model);
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]UpdateModel model)
        {
            var user = mapper.Map<User>(model);
            user.Id = id;

            userService.Update(user, model.Password);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            userService.Delete(id);
            return Ok();
        }
    }
}

