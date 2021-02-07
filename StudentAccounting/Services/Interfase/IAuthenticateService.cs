using Microsoft.AspNetCore.Identity;
using StudentAccounting.Entities;
using StudentAccounting.Models;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IAuthenticateService
    {
        User Login(AuthenticateModel model);
        void VerifyEmail(string token);
        Task<IdentityResult> Register(User user, string password);
        User RegisterFacebook(User user);
        User FacebookLogin(FacebookAccount model);
    }
}
