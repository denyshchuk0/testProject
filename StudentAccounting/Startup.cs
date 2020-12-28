using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using StudentAccounting.Helpers;
using StudentAccounting.Models;
using StudentAccounting.Services;
using StudentAccounting.Services.Interfase;
using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Hangfire;

namespace StudentAccounting
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>();

            services.AddHttpContextAccessor();
            services.AddCors();
            services.AddControllers();
            services.AddMvc().AddFluentValidation();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddTransient<IValidator<RegisterModel>, RegisterModelValidator>();
            services.AddTransient<IValidator<AuthenticateModel>, AuthenticateModelValidator>();
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var appSettins = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettins.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
              .AddJwtBearer(x =>
              {
                 
                  x.RequireHttpsMetadata = false;
                  x.SaveToken = true;
                  x.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuerSigningKey = true,
                      NameClaimType = ClaimTypes.NameIdentifier,
                      IssuerSigningKey = new SymmetricSecurityKey(key),
                      ValidateIssuer = false,
                      ValidateAudience = false
                  };
              })
              .AddFacebook(facebookOptions =>
              {  
                  facebookOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                  facebookOptions.AppId = Configuration["Authentication:Facebook:AppId"];
                  facebookOptions.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
              }).AddCookie();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthenticateService, AuthenticateService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddTransient<INotificationEmailSender, NotificationEmailSender>();

            services.AddHangfire(config =>
               config.UseSqlServerStorage(Configuration.GetConnectionString("Connection")));

            services.AddHangfireServer();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHangfireServer();
            app.UseHangfireDashboard();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseDefaultFiles();
            app.UseRouting();
            app.UseCors(x => x
              .AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCookiePolicy();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
