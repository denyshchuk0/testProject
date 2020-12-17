using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Resources;
using StudentAccounting.Services.Interfase;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly IEmailService emailService;
        private readonly DataContext context;
        private readonly IFacebookService facebookService;
        private readonly IJwtHandler jwtHandler;

        public AuthenticateService(DataContext context,
                                   IEmailService emailService,
                                   IFacebookService facebookService,
                                   IJwtHandler jwtHandler)
        {
            this.context = context;
            this.emailService = emailService;
            this.facebookService = facebookService;
            this.jwtHandler = jwtHandler;
        }

        public User Login(AuthenticateModel model)
        {
            var user = context.Users.SingleOrDefault(x => x.Email == model.Email || x.Email == model.Email.ToUpper());
            user.Role = context.Roles.SingleOrDefault(x => x.Id == user.RoleId);
            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            return user;
        }

        public async Task<AuthorizationTokensResource> FacebookLoginAsync(FacebookLoginResource facebookLoginResource)
        {
            if (string.IsNullOrEmpty(facebookLoginResource.facebookToken))
            {
                throw new Exception("Token is null or empty");
            }

            var facebookUser = await facebookService.GetUserFromFacebookAsync(facebookLoginResource.facebookToken);
            var domainUser = context.Users.SingleOrDefault(x => x.Email == facebookUser.Email);

            return CreateAccessTokens(domainUser);
        }
        public async Task<User> Register(User user, string password)
        {
            if (context.Users.Any(x => x.Email == user.Email))
            {
                throw new AppException("Username \"" + user.Email + "\" is already taken");
            }

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.RegisteredDate = DateTime.Now;
            user.VerificationToken = RandomTokenString();
            Role userRole =  context.Roles.FirstOrDefault(r => r.Name == "user");
            if (userRole != null)
            {
                user.Role = userRole;
            }
            context.Users.Add(user);
            context.SaveChanges();

            await emailService.SendEmailAsync(
                user.Email,
                "Confirm regist",
                $"https://localhost:44335/users/verify-email?token={user.VerificationToken}");

            return user;
        }
        public void VerifyEmail(string token)
        {
            var account = context.Users.SingleOrDefault(x => x.VerificationToken == token);

            if (account == null)
            {
                throw new AppException("Verification failed");
            }

            account.VerificationToken = null;
            account.isVerificated = true;

            context.Users.Update(account);
            context.SaveChanges();
        }

        private string RandomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private AuthorizationTokensResource CreateAccessTokens(User user)
        {
            var accessToken = jwtHandler.CreateAccessToken(user.Id, user.Email);
            var refreshToken = jwtHandler.CreateRefreshToken(user.Id);

            return new AuthorizationTokensResource { AccessToken = accessToken, RefreshToken = refreshToken };
        }

        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new AppException("Value cannot be empty or whitespace only string.", "password");
            }

            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new AppException("Value cannot be empty or whitespace only string.", "password");
            }
            if (storedHash.Length != 64)
            {
                throw new AppException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            }
            if (storedSalt.Length != 128)
            {
                throw new AppException("Invalid length of password salt (128 bytes expected).", "passwordHash");
            }

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
