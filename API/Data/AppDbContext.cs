using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{

    public DbSet<AppUser> Users { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<Photo> Photos { get; set; }

    public DbSet<MemberLikes> Likes { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MemberLikes>().HasKey(x=> new{x.SourceMemberId , x.TargetMemberId});

        modelBuilder.Entity<MemberLikes>().HasOne(x=>x.SourceMember).WithMany(x=>x.LikedMembers)
        .HasForeignKey(x=>x.SourceMemberId).OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MemberLikes>().HasOne(x=>x.TargetMember).WithMany(x=>x.LikedByMembers)
        .HasForeignKey(x=>x.TargetMemberId).OnDelete(DeleteBehavior.Cascade);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
             v => v.ToUniversalTime(),
             v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

foreach (var entityType in modelBuilder.Model.GetEntityTypes())
{
    foreach (var property in entityType.GetProperties())
    {
        if (property.ClrType == typeof(DateTime))
        {
            property.SetValueConverter(dateTimeConverter);
        }
    }
}
    }

}
