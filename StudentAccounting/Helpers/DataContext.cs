using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StudentAccounting.Entities;

namespace StudentAccounting.Helpers
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;
        
        public DbSet<User> Users { get; set; }
        public DbSet<Course> Course { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
      

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(Configuration.GetConnectionString("Connection"));
        }
    }
}
