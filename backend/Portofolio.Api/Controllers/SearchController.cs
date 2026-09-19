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
public class SearchController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/search?q={keyword}
    [HttpGet]
    public async Task<ActionResult<SearchResultsDto>> Search([FromQuery] string? q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Trim().Length < 2)
        {
            return Ok(new SearchResultsDto { Query = q ?? string.Empty });
        }

        var keyword = q.Trim();
        var pattern = $"%{keyword}%";

        // 1. Kueri Proyek (Title, Summary, Description, atau Nama Tag)
        var projects = await context.Projects
            .AsNoTracking()
            .Where(p => EF.Functions.ILike(p.Title, pattern) ||
                        EF.Functions.ILike(p.Summary, pattern) ||
                        EF.Functions.ILike(p.Description, pattern) ||
                        p.Tags.Any(t => EF.Functions.ILike(t.Name, pattern)))
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

        // 2. Kueri Devlogs (Hanya yang berstatus Published)
        var devlogs = await context.Devlogs
            .Include(d => d.Project)
            .AsNoTracking()
            .Where(d => d.IsPublished &&
                        (EF.Functions.ILike(d.Title, pattern) ||
                         EF.Functions.ILike(d.Content, pattern) ||
                         d.Tags.Any(t => EF.Functions.ILike(t.Name, pattern))))
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

        // 3. Kueri Ilustrasi Visual (Title, Description, atau Nama Tag)
        var illustrations = await context.Illustrations
            .AsNoTracking()
            .Where(i => EF.Functions.ILike(i.Title, pattern) ||
                        (i.Description != null && EF.Functions.ILike(i.Description, pattern)) ||
                        i.Tags.Any(t => EF.Functions.ILike(t.Name, pattern)))
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

        return Ok(new SearchResultsDto
        {
            Query = keyword,
            Projects = projects,
            Devlogs = devlogs,
            Illustrations = illustrations
        });
    }
}