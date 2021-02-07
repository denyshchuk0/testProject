using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using NLog;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
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
        private readonly IHttpClientFactory httpClientFactory;


        public AuthenticateController(IAuthenticateService authenticateService,
                                      IMapper mapper,
                                      IOptions<AppSettings> appSettings,
                                      IOptions<RegisterModelValidator> registerValidations,
                                      IOptions<AuthenticateModelValidator> authenticateValidator,
                                      IHttpClientFactory httpClientFactory)
        {
            this.authenticateService = authenticateService;
            this.appSettings = appSettings.Value;
            this.registerValidations = registerValidations.Value;
            this.authenticateValidator = authenticateValidator.Value;
            this.mapper = mapper;
            this.httpClientFactory = httpClientFactory;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
           var result = authenticateValidator.Validate(model);
            if (result.IsValid)
            {
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
                return UserResult(user);
            }
            return BadRequest(result.Errors);
        }

        private IActionResult UserResult(User user)
        {
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
            var courses = mapper.Map<ICollection<UsersCoursesModel>>(user.Courses);
            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Age,
                user.RegisteredDate,
                user.Role.Name,
                courses,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            var result=registerValidations.Validate(model);
            if (result.IsValid)
            {
                var user = mapper.Map<User>(model);
                var res = authenticateService.Register(user, model.Password);
                if (res.Result.Succeeded)
                {
                    return Ok();
                }
                return Conflict();
            }
            return Conflict(result.Errors);
           
        }

        [Route("/error")]
        public IActionResult Error() => Problem();

        [HttpPost]
        [AllowAnonymous]
        [Route("facebook-login")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookToken facebookToken)
        {
            var httpClient = httpClientFactory.CreateClient();
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v4.0/");
            var response = await httpClient.GetAsync($"me?access_token={facebookToken.Token}&fields=id,email,first_name,last_name");

            if (!response.IsSuccessStatusCode)
            {
                logger.Error("Error. Response was not success!");
                return Conflict();
            };

            var result = await response.Content.ReadAsStringAsync();
            var facebookAccount = JsonConvert.DeserializeObject<FacebookAccount>(result);

            var user = authenticateService.FacebookLogin(facebookAccount);
            if (user == null)
            {
                var model = mapper.Map<RegisterModel>(facebookAccount);
                var userRegister = mapper.Map<User>(model);
                authenticateService.RegisterFacebook(userRegister);
                user = authenticateService.FacebookLogin(facebookAccount);
            }

            return UserResult(user);
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
