using Microsoft.EntityFrameworkCore;
using Portofolio.Domain.Entities;

namespace Portofolio.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    // Constructor: Menerima setting konfigurasi (seperti tipe database & connection string)
    // dan mengopernya ke base class (DbContext bawaan .NET)
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // DbSet<T> = Representasi dari Tabel di Database
    // Set<T>() memastikan properti ini tidak bernilai null saat diinisialisasi
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Devlog> Devlogs => Set<Devlog>();
    public DbSet<Illustration> Illustrations => Set<Illustration>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>().HasIndex(p => p.Slug).IsUnique();
        modelBuilder.Entity<Devlog>().HasIndex(d => d.Slug).IsUnique();
        modelBuilder.Entity<Illustration>().HasIndex(i => i.Slug).IsUnique();
        modelBuilder.Entity<Tag>().HasIndex(t => t.Slug).IsUnique();

        modelBuilder.Entity<Devlog>()
            .HasOne(d => d.Project) // Setiap Devlog punya 1 Project induk
            .WithMany(p => p.Devlogs) // 1 Project punya banyak Devlog
            .HasForeignKey(d => d.ProjectId) // Kuncinya ada di kolom Devlog.ProjectId
            .OnDelete(DeleteBehavior.Cascade); // Jika Project dihapus, hapus juga semua Devlog-nya
    }
}