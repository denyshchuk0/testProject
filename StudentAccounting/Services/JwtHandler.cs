using AutoMapper.Configuration;
using Microsoft.IdentityModel.Tokens;
using StudentAccounting.Resources;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace StudentAccounting.Services
{
    public interface IJwtHandler {
        TokenResource CreateAccessToken(int userId, string email);
        public TokenResource CreateRefreshToken(int userId);
    }

    public class JwtHandler:IJwtHandler
    {
        public TokenResource CreateAccessToken(int userId, string email)
        {
            var now = DateTime.Now;
            var claims = new Claim[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
          
            };

           // var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Tokens:Secret"])),
                //SecurityAlgorithms.HmacSha256);
            var jwt = CreateSecurityToken(claims, now);
            var token = new JwtSecurityTokenHandler().WriteToken(jwt);

            return CreateTokenResource(token);
        }

        public TokenResource CreateRefreshToken(int userId)
        {
            var now = DateTime.UtcNow;
            var claims = new Claim[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
           
            };

           // var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Tokens:Key"])),
               // SecurityAlgorithms.HmacSha256);
            var jwt = CreateSecurityToken(claims, now);
            var token = new JwtSecurityTokenHandler().WriteToken(jwt);

            return CreateTokenResource(token);
        }

        private JwtSecurityToken CreateSecurityToken(IEnumerable<Claim> claims, DateTime now)
            => new JwtSecurityToken(claims: claims, notBefore: now);

        private static TokenResource CreateTokenResource(string token)
            => new TokenResource { Token = token};

    }
}
