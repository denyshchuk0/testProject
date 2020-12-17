using StudentAccounting.Entities;
using StudentAccounting.Models;
using StudentAccounting.Resources;
using System.Threading.Tasks;

namespace StudentAccounting.Services.Interfase
{
    public interface IAuthenticateService
    {
        User Login(AuthenticateModel model);
        void VerifyEmail(string token);
        Task<User> Register(User user, string password);
        Task<AuthorizationTokensResource> FacebookLoginAsync(FacebookLoginResource facebookLoginResource);

    }
}
