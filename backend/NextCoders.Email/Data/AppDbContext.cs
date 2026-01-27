using Microsoft.EntityFrameworkCore;
using NextCoders.Email.Models;

namespace NextCoders.Email.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<EmailResponse> Dbemails { get; set; }
    }
}
