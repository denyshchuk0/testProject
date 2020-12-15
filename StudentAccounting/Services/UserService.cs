using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public interface IUserService
    {
        User Authenticate(AuthenticateModel model);
        IEnumerable<User> GetAllUsers();
        IEnumerable<Course> GetAllCourses();
        void CreateUsersCourse(int userId, int coursId);
        User GetById(int id);
        void VerifyEmail(string token);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(int id);
        Task<AuthorizationTokensResource> FacebookLoginAsync(FacebookLoginResource facebookLoginResource);
    }
    public class UserService : IUserService
    {
        private readonly IRegisterAccountService emailService;
        private readonly DataContext context;
        private readonly IFacebookService facebookService;
        private readonly IJwtHandler jwtHandler;

        public UserService(DataContext context,
                           IRegisterAccountService emailService,
                           IFacebookService facebookService,
                           IJwtHandler jwtHandler)
        {
            this.context = context;
            this.emailService = emailService;
            this.facebookService = facebookService;
            this.jwtHandler = jwtHandler;
        }
        public User Authenticate(AuthenticateModel model)
        {
            var user = context.Users.SingleOrDefault(x => x.Email == model.Email || x.Email == model.Email.ToUpper());
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

        private AuthorizationTokensResource CreateAccessTokens(User user)
        {
            var accessToken = jwtHandler.CreateAccessToken(user.Id, user.Email);
            var refreshToken = jwtHandler.CreateRefreshToken(user.Id);

            return new AuthorizationTokensResource { AccessToken = accessToken, RefreshToken = refreshToken };
        }

        public IEnumerable<User> GetAllUsers()
        {
            return context.Users;
        }

        public IEnumerable<Course> GetAllCourses()
        {
            return context.Course;
        }

        public User GetById(int id)
        {
            return context.Users.Find(id);
        }

        public User Create(User user, string password)
        {
            if (context.Users.Any(x => x.Email == user.Email))
            {
                throw new AppException("Username \"" + user.Email + "\" is already taken");
            }
            else
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.RegisteredDate = DateTime.Now;
                user.VerificationToken = RandomTokenString();
                context.Users.Add(user);
                context.SaveChanges();

                emailService.SendEmailAsync(user.Email, "Confirm regist", $"https://localhost:44335/users/verify-email?token={user.VerificationToken}");
            }
            return user;
        }

        public void CreateUsersCourse(int userId, int coursId )
        {
            var user= context.Users.SingleOrDefault(x => x.Id == userId);
            var cours = context.Course.SingleOrDefault(x => x.Id == coursId);
            user.Courses.Add(cours);
            context.Users.Update(user);
            context.SaveChanges();

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

        public void Delete(int id)
        {
            var user = context.Users.Find(id);
            if (user != null)
            {
                context.Users.Remove(user);
                context.SaveChanges();
            }
        }

        public void Update(User userParam, string password = null)
        {
            var user = context.Users.Find(userParam.Id);

            if (user == null)
            {
                throw new AppException("User not found");
            }

            if (!string.IsNullOrWhiteSpace(userParam.Email) && userParam.Email != user.Email)
            {
                if (context.Users.Any(x => x.Email == userParam.Email))
                {
                    throw new AppException("Username " + userParam.Email + " is already taken");
                }

                user.Email = userParam.Email;

                if (!string.IsNullOrWhiteSpace(userParam.FirstName))
                {
                    user.FirstName = userParam.FirstName;
                }

                if (!string.IsNullOrWhiteSpace(userParam.LastName))
                {
                    user.LastName = userParam.LastName;
                }

                //if (!string.IsNullOrWhiteSpace(password))
                //{
                //    byte[] passwordHash, passwordSalt;
                //    CreatePasswordHash(password, out passwordHash, out passwordSalt);

                //    user.PasswordHash = passwordHash;
                //    user.PasswordSalt = passwordSalt;
                //}
                context.Users.Update(user);
                context.SaveChanges();
            }
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
