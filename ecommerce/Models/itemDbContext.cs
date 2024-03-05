using Microsoft.EntityFrameworkCore;

namespace ecommerce.Models
{
  public class itemDbContext : DbContext
  {
    public itemDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<item> items { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

    }
  }
}
