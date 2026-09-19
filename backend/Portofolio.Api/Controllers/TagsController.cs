using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Application.DTOs.Devlogs;
using Portofolio.Application.DTOs.Illustrations;
using Portofolio.Application.DTOs.Projects;
using Portofolio.Application.DTOs.Search;
using Portofolio.Infrastructure.Persistence;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/tags (Menghitung frekuensi seluruh tag aktif)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TagSummaryDto>>> GetAllTags()
    {
        var tags = await context.Tags
            .AsNoTracking()
            .Select(t => new TagSummaryDto
            {
                Name = t.Name,
                Slug = t.Slug,
                UsageCount = t.Projects.Count +
                             t.Devlogs.Count(d => d.IsPublished) +
                             t.Illustrations.Count
            })
            .Where(t => t.UsageCount > 0)
            .OrderByDescending(t => t.UsageCount)
            .ToListAsync();

        return Ok(tags);
    }

    // GET: api/tags/{slug} (Mengambil semua konten terkait satu tag tertentu)
    [HttpGet("{slug}")]
    public async Task<ActionResult<TagDetailDto>> GetTagContents(string slug)
    {
        var cleanSlug = slug.Trim().ToLowerInvariant().TrimStart('#');

        var tag = await context.Tags
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Slug == cleanSlug);

        if (tag == null)
        {
            return NotFound(new { message = $"Tag #{cleanSlug} belum digunakan pada karya apa pun." });
        }

        var projects = await context.Projects
            .AsNoTracking()
            .Where(p => p.Tags.Any(t => t.Slug == cleanSlug))
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Summary = p.Summary,
                Description = p.Description,
                ThumbnailUrl = p.ThumbnailUrl,
                RepositoryUrl = p.RepositoryUrl,
                DemoUrl = p.DemoUrl,
                IsFeatured = p.IsFeatured,
                IsOnGoing = p.IsOnGoing,
                IsFinished = p.IsFinished,
                CreatedAt = p.CreatedAt,
                Tags = p.Tags.Select(t => t.Name).ToList()
            })
            .ToListAsync();

        var devlogs = await context.Devlogs
            .Include(d => d.Project)
            .AsNoTracking()
            .Where(d => d.IsPublished && d.Tags.Any(t => t.Slug == cleanSlug))
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DevlogDto
            {
                Id = d.Id,
                Title = d.Title,
                Slug = d.Slug,
                Content = d.Content,
                IsPublished = d.IsPublished,
                CreatedAt = d.CreatedAt,
                ProjectId = d.ProjectId,
                ProjectTitle = d.Project.Title,
                Tags = d.Tags.Select(t => t.Name).ToList()
            })
            .ToListAsync();

        var illustrations = await context.Illustrations
            .AsNoTracking()
            .Where(i => i.Tags.Any(t => t.Slug == cleanSlug))
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
                Tags = i.Tags.Select(t => t.Name).ToList()
            })
            .ToListAsync();

        return Ok(new TagDetailDto
        {
            Name = tag.Name,
            Slug = tag.Slug,
            Projects = projects,
            Devlogs = devlogs,
            Illustrations = illustrations
        });
    }
}