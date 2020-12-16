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
    //[Route("[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IAuthenticateService authenticateService;
        private readonly IMapper mapper;
        private readonly AppSettings appSettings;
        private readonly RegisterModelValidator registerValidations;
        private readonly AuthenticateModelValidator authenticateValidator;

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
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            registerValidations.Validate(model);
            var user = mapper.Map<User>(model);
            authenticateService.Register(user, model.Password);
            return Ok();
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
