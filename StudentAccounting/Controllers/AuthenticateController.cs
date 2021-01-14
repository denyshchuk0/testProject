using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NLog;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StudentAccounting.Controllers
{
    [Authorize]
    [Route("authenticate")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IAuthenticateService authenticateService;
        private readonly IMapper mapper;
        private readonly AppSettings appSettings;
        private readonly RegisterModelValidator registerValidations;
        private readonly AuthenticateModelValidator authenticateValidator;
        private static Logger logger = LogManager.GetCurrentClassLogger();


        public AuthenticateController(IAuthenticateService authenticateService,
                                      IMapper mapper,
                                      IOptions<AppSettings> appSettings,
                                      IOptions<RegisterModelValidator> registerValidations,
                                      IOptions<AuthenticateModelValidator> authenticateValidator)
        {
            this.authenticateService = authenticateService;
            this.appSettings = appSettings.Value;
            this.registerValidations = registerValidations.Value;
            this.authenticateValidator = authenticateValidator.Value;
            this.mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            authenticateValidator.Validate(model);
            var user = authenticateService.Login(model);

            if (user == null)
            {
                logger.Error("Error. User not found!");
                return NotFound(new { message = "User not found!" });
            }
            if (!user.isVerificated)
            {
                logger.Error("Error. Email is not confirmed");
                return BadRequest(new { message = "Email is not confirmed" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role?.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            var courses = mapper.Map<ICollection<CourseModel>>(user.Courses);
            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Age,
                user.RegisteredDate,
                courses,
                user.Role.Name,
                Token = tokenString
            });
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            registerValidations.Validate(model);
            var user = mapper.Map<User>(model);

            authenticateService.Register(user, model.Password);
            return Ok();
        }

        [AllowAnonymous]
        [Route("facebook-login")]
        public IActionResult FacebookLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("FacebookResponse") };
            return Challenge(properties, FacebookDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [Route("facebook-response")]
        public async Task<IActionResult> FacebookResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var claims = result.Principal.Identities
                .FirstOrDefault().Claims.Select(claim => new
                {
                    claim.Value
                });
            return Ok(claims);
        }

        [AllowAnonymous]
        [HttpGet("verify-email")]
        public IActionResult VerifyEmail(string token)
        {
            authenticateService.VerifyEmail(token);
            return Ok();
        }
    }
}
