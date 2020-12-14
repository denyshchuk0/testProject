using Newtonsoft.Json;
using StudentAccounting.Resources;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public interface IFacebookService
    {
        Task<FacebookUserResource> GetUserFromFacebookAsync(string facebookToken);
    }

    public class FacebookService : IFacebookService
    {
        private readonly HttpClient httpClient;

        public FacebookService()
        {
            httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://graph.facebook.com/v9.0/")
            };
            httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        public async Task<FacebookUserResource> GetUserFromFacebookAsync(string facebookToken)
        {
            var result = await GetAsync<dynamic>(facebookToken, "me", "fields=first_name,last_name,email");
            if (result == null)
            {
                throw new Exception("User from this token not exist");
            }

            var account = new FacebookUserResource()
            {
                Email = result.email,
                FirstName = result.first_name,
                LastName = result.last_name

            };

            return account;
        }

        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args = null)
        {
            var response = await httpClient.GetAsync($"{endpoint}?access_token={accessToken}&{args}");
            if (!response.IsSuccessStatusCode)
                return default(T);

            var result = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<T>(result);
        }

       
    }
}
