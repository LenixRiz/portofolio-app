using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Application.DTOs.Illustrations;
using Portofolio.Domain.Entities;
using Portofolio.Infrastructure.Persistence;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IllustrationsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/illustrations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IllustrationDto>>> GetIllustrations()
    {
        var illustrations = await context.Illustrations
            .AsNoTracking()
            .OrderByDescending(i => i.CompletedAt ?? i.CreatedAt)
            .Select(i => new IllustrationDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                ImageUrl = i.ImageUrl,
                ThumbnailUrl = i.ThumbnailUrl,
                CompletedAt = i.CompletedAt,
                CreatedAt = i.CreatedAt,
                Tags = i.Tags.Select(t => t.Name).Where(n => !string.IsNullOrWhiteSpace(n)).ToList()
            })
            .ToListAsync();

        return Ok(illustrations);
    }

    // POST: api/illustrations
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<IllustrationDto>> CreateIllustration(CreateIllustrationDto dto)
    {
        // 1. Generate slug unik secara otomatis dari Title
        var slug = await GenerateUniqueSlugAsync(dto.Title);

        var illustration = new Illustration
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Slug = slug, // Menetapkan slug unik agar tidak terjadi constraint collision
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            ImageUrl = dto.ImageUrl.Trim(),
            ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? dto.ImageUrl.Trim() : dto.ThumbnailUrl.Trim(),
            CompletedAt = dto.CompletedAt
        };

        // 2. Sanitasi dan asosiasi relasi Tag
        List<string> rawInput = dto.TagNames ?? new List<string>();
        List<string> cleanTagNames = rawInput
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (string name in cleanTagNames)
        {
            string tagSlug = name.ToLower().Replace(" ", "-");
            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
            if (existingTag == null)
            {
                existingTag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Slug = tagSlug
                };
                context.Tags.Add(existingTag);
            }

            illustration.Tags.Add(existingTag);
        }

        context.Illustrations.Add(illustration);
        await context.SaveChangesAsync();

        var resultDto = new IllustrationDto
        {
            Id = illustration.Id,
            Title = illustration.Title,
            Description = illustration.Description,
            ImageUrl = illustration.ImageUrl,
            ThumbnailUrl = illustration.ThumbnailUrl,
            CompletedAt = illustration.CompletedAt,
            CreatedAt = illustration.CreatedAt,
            Tags = illustration.Tags.Select(t => t.Name).ToList()
        };

        return CreatedAtAction(nameof(GetIllustrations), new { id = illustration.Id }, resultDto);
    }

    // PUT: api/illustrations/{id}
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<IllustrationDto>> UpdateIllustration(Guid id, UpdateIllustrationDto dto)
    {
        var illustration = await context.Illustrations
            .Include(i => i.Tags)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (illustration == null)
        {
            return NotFound(new { message = $"Ilustrasi dengan ID '{id}' tidak ditemukan." });
        }

        var cleanTitle = dto.Title.Trim();
        // Perbarui slug jika judul karya diubah
        if (illustration.Title != cleanTitle)
        {
            illustration.Slug = await GenerateUniqueSlugAsync(cleanTitle, illustration.Id);
            illustration.Title = cleanTitle;
        }

        illustration.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        illustration.ImageUrl = dto.ImageUrl.Trim();
        illustration.ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? dto.ImageUrl.Trim() : dto.ThumbnailUrl.Trim();
        illustration.CompletedAt = dto.CompletedAt;

        // Differential Tag Mutation
        List<string> rawInput = (dto.TagNames != null && dto.TagNames.Count > 0 ? dto.TagNames : dto.Tags) ?? new List<string>();
        List<string> cleanTagNames = rawInput
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        HashSet<string> targetSlugs = cleanTagNames
            .Select(t => t.ToLower().Replace(" ", "-"))
            .ToHashSet();

        // Hapus relasi tag lama
        var tagsToRemove = illustration.Tags.Where(t => !targetSlugs.Contains(t.Slug)).ToList();
        foreach (var tag in tagsToRemove)
        {
            illustration.Tags.Remove(tag);
        }

        // Tambah relasi tag baru
        HashSet<string> currentSlugs = illustration.Tags.Select(t => t.Slug).ToHashSet();
        foreach (string name in cleanTagNames)
        {
            string tagSlug = name.ToLower().Replace(" ", "-");
            if (currentSlugs.Contains(tagSlug)) continue;

            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
            if (existingTag == null)
            {
                existingTag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Slug = tagSlug
                };
                context.Tags.Add(existingTag);
            }

            illustration.Tags.Add(existingTag);
        }

        await context.SaveChangesAsync();

        return Ok(new IllustrationDto
        {
            Id = illustration.Id,
            Title = illustration.Title,
            Description = illustration.Description,
            ImageUrl = illustration.ImageUrl,
            ThumbnailUrl = illustration.ThumbnailUrl,
            CompletedAt = illustration.CompletedAt,
            CreatedAt = illustration.CreatedAt,
            Tags = illustration.Tags.Select(t => t.Name).Where(n => !string.IsNullOrWhiteSpace(n)).ToList()
        });
    }

    // DELETE: api/illustrations/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIllustration(Guid id)
    {
        var illustration = await context.Illustrations.FindAsync(id);
        if (illustration == null)
        {
            return NotFound(new { message = $"Ilustrasi dengan ID '{id}' tidak ditemukan." });
        }

        context.Illustrations.Remove(illustration);
        await context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Menghasilkan slug yang URL-friendly dan menjamin tidak ada duplikasi di PostgreSQL.
    /// </summary>
    private async Task<string> GenerateUniqueSlugAsync(string title, Guid? currentId = null)
    {
        // 1. Bersihkan karakter aneh dan ubah spasi menjadi tanda strip '-'
        string baseSlug = Regex.Replace(title.ToLower().Trim(), @"[^a-z0-9\s-]", "");
        baseSlug = Regex.Replace(baseSlug, @"\s+", "-").Trim('-');

        if (string.IsNullOrWhiteSpace(baseSlug))
        {
            baseSlug = "artwork";
        }

        string uniqueSlug = baseSlug;
        int suffix = 1;

        // 2. Loop verifikasi ke database: jika slug sudah dipakai oleh data lain, tambahkan akhiran angka (-1, -2, dst)
        while (await context.Illustrations.AnyAsync(i => i.Slug == uniqueSlug && (currentId == null || i.Id != currentId)))
        {
            uniqueSlug = $"{baseSlug}-{suffix++}";
        }

        return uniqueSlug;
    }
}