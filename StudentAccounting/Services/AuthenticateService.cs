using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit.Encodings;
using NLog;
using StudentAccounting.Entities;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services.Interfase;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly IEmailSender emailService;
        private readonly DataContext context;
        private readonly IOptions<AppSettings> settings;
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public AuthenticateService(DataContext context,
                                   IEmailSender emailService,
                                   IOptions<AppSettings> settings)
        {
            this.context = context;
            this.emailService = emailService;
            this.settings = settings;
        }

        public User Login(AuthenticateModel model)
        {
            var user = context.Users.Include(x=>x.Role).Include(y => y.Courses).FirstOrDefault(z => z.Email.ToUpper() == model.Email.ToUpper());

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

        public User FacebookLogin(FacebookAccount model)
        {
            var user = context.Users.Include(x => x.Role).Include(y => y.Courses).FirstOrDefault(z => z.Email.ToUpper() == model.Email.ToUpper());

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<User> Register(User user, string password)
        {
            if (context.Users.Any(x => x.Email.ToUpper() == user.Email.ToUpper()))
            {
                logger.Error("Username \"" + user.Email + "\" is already taken");
                throw new Exception("Username \"" + user.Email + "\" is already taken");
            }

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.RegisteredDate = DateTime.UtcNow;
            user.VerificationToken = RandomTokenString();

            Role userRole = context.Roles.FirstOrDefault(r => r.Name == "student");
            if (userRole != null)
            {
                user.Role = userRole;
            }

            context.Users.Add(user);
            logger.Info("User has registered!");

            context.SaveChanges();
            await emailService.SendEmailAsync(
                user.Email,
                "Confirm registration",
                settings.Value.BaseUrl+$"authenticate/verify-email?token={user.VerificationToken}");

            return user;
        }

        public User RegisterFacebook(User user)
        {
            if (context.Users.Any(x => x.Email.ToUpper() == user.Email.ToUpper()))
            {
                logger.Error("Username \"" + user.Email + "\" is already taken");
                throw new Exception("Username \"" + user.Email + "\" is already taken");
            }
            
            user.RegisteredDate = DateTime.UtcNow;

            Role userRole = context.Roles.FirstOrDefault(r => r.Name == "student");
            if (userRole != null)
            {
                user.Role = userRole;
            }

            user.isVerificated = true;
            context.Users.Add(user);
            context.SaveChanges();

            return user;
        }
        public void VerifyEmail(string token)
        {
            var account = context.Users.SingleOrDefault(x => x.VerificationToken == token);

            if (account == null)
            {
                logger.Error("Verification failed!");
                throw new Exception("Verification failed");
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

        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null || string.IsNullOrWhiteSpace(password))
            {
                throw new Exception("Password cannot be empty or whitespace only string.");
            }

            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }

        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new Exception("Password cannot be empty or whitespace only string.");
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
