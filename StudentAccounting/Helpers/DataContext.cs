using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using StudentAccounting.Entities;
using StudentAccounting.Entities.Config;

namespace StudentAccounting.Helpers
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Course> Course { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<UsersCourses> UsersCourses { get; set; }

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new UsersCoursesConfig());
        }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("Connection"));
        }
    }
}
