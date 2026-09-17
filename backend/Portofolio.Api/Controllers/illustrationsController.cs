using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Infrastructure.Persistence;
using Portofolio.Domain.Entities;
using Portofolio.Application.DTOs.Illustrations;
using Microsoft.AspNetCore.Components.Web;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IllustrationController(ApplicationDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IllustrationDto>>> GetIllustrations()
    {
        var illustrations = await context.Illustrations
            .Include(i => i.Tags)
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new IllustrationDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                ImageUrl = i.ImageUrl,
                ThumbnailUrl = i.ThumbnailUrl,
                CompletedAt = i.CompletedAt,
                CreatedAt = i.CreatedAt,
                Tags = i.Tags.Select(t => t.Name).ToList()
            })
            .ToListAsync();
        
        return Ok(illustrations);
    }

    [HttpPost]
    public async Task<ActionResult<IllustrationDto>> CreateIllustration(CreateIllustrationDto dto)
    {
        var illustration = new Illustration
        {
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            ThumbnailUrl = dto.ThumbnailUrl,
            CompletedAt = dto.CompletedAt,
        };

        foreach (var name in dto.TagNames)
        {
            var cleanName = name.Trim();
            var tagSlug = cleanName.ToLower().Replace(" ", "-");

            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
            if (existingTag == null)
            {
                existingTag = new Tag { Name = cleanName, Slug = tagSlug };
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

        return CreatedAtAction(nameof(GetIllustrations), new {id = illustration.Id}, resultDto);
    }
}