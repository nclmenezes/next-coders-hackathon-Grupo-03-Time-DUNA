using Microsoft.EntityFrameworkCore;
using NextCoders.Email.Models;

namespace ProjetoDbEmails.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) {}

        public DbSet<EmailResponse> Dbemails {get; set;}
    }
}