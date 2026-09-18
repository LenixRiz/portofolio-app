using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
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
        var illustration = new Illustration
        {
            Title = dto.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            ImageUrl = dto.ImageUrl.Trim(),
            ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? dto.ImageUrl.Trim() : dto.ThumbnailUrl.Trim(),
            CompletedAt = dto.CompletedAt
        };

        // Sanitasi tag input secara eksplisit
        List<string> rawInput = dto.TagNames ?? new List<string>();
        List<string> cleanTagNames = rawInput
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (string name in cleanTagNames)
        {
            string slug = name.ToLower().Replace(" ", "-");
            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == slug);
            if (existingTag == null)
            {
                existingTag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Slug = slug
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
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<IllustrationDto>> UpdateIllustration(Guid id, UpdateIllustrationDto dto)
    {
        var illustration = await context.Illustrations
            .Include(i => i.Tags)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (illustration == null)
        {
            return NotFound(new { message = $"Ilustrasi dengan ID '{id}' tidak ditemukan." });
        }

        illustration.Title = dto.Title.Trim();
        illustration.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        illustration.ImageUrl = dto.ImageUrl.Trim();
        illustration.ThumbnailUrl = string.IsNullOrWhiteSpace(dto.ThumbnailUrl) ? dto.ImageUrl.Trim() : dto.ThumbnailUrl.Trim();
        illustration.CompletedAt = dto.CompletedAt;

        // Differential Tag Mutation dengan tipe data eksplisit
        List<string> rawInput = (dto.TagNames != null && dto.TagNames.Count > 0 ? dto.TagNames : dto.Tags) ?? new List<string>();

        List<string> cleanTagNames = rawInput
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        HashSet<string> targetSlugs = cleanTagNames
            .Select(t => t.ToLower().Replace(" ", "-"))
            .ToHashSet();

        // 1. Hapus relasi tag yang dicabut pengguna
        var tagsToRemove = illustration.Tags
            .Where(t => !targetSlugs.Contains(t.Slug))
            .ToList();

        foreach (var tag in tagsToRemove)
        {
            illustration.Tags.Remove(tag);
        }

        // 2. Tambah relasi tag baru
        HashSet<string> currentSlugs = illustration.Tags.Select(t => t.Slug).ToHashSet();

        foreach (string name in cleanTagNames)
        {
            string slug = name.ToLower().Replace(" ", "-");
            if (currentSlugs.Contains(slug)) continue;

            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == slug);
            if (existingTag == null)
            {
                existingTag = new Tag
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Slug = slug
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
            Tags = illustration.Tags
                .Select(t => t.Name)
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .ToList()
        });
    }

    // DELETE: api/illustrations/{id}
    [Authorize]
    [HttpDelete("{id:guid}")]
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
}