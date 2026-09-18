using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Application.DTOs.Projects;
using Portofolio.Domain.Entities;
using Portofolio.Infrastructure.Persistence;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/projects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var projects = await context.Projects
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt) // Sort dari paling bawah
            .Select(p => new ProjectDto // ambil variabel
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
                CreatedAt = p.CreatedAt,
                Tags = p.Tags.Select(t => t.Name).ToList()
            })
            .ToListAsync();
        
        return Ok(projects);
    }

    // POST: api/projects
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
    {
        var slug = dto.Title.Trim().ToLower().Replace(" ", "-");
        if (await context.Projects.AnyAsync(p => p.Slug == slug))
        {
            return BadRequest(new { message = "Proyek dengan judul/slug tersebut sudah ada." });
        }

        var project = new Project
        {
            Title = dto.Title.Trim(),
            Slug = slug,
            Summary = dto.Summary.Trim(),
            Description = dto.Description.Trim(),
            ThumbnailUrl = dto.ThumbnailUrl.Trim(),
            RepositoryUrl = string.IsNullOrWhiteSpace(dto.RepositoryUrl) ? null : dto.RepositoryUrl.Trim(),
            DemoUrl = string.IsNullOrWhiteSpace(dto.DemoUrl) ? null : dto.DemoUrl.Trim(),
            IsFeatured = dto.IsFeatured
        };

        // Sanitasi input: buang '#', hapus spasi, filter teks kosong
        var cleanTagNames = (dto.TagNames ?? new List<string>())
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var name in cleanTagNames)
        {
            var tagSlug = name.ToLower().Replace(" ", "-");
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
            project.Tags.Add(existingTag);
        }

        context.Projects.Add(project);
        await context.SaveChangesAsync();

        var resultDto = new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Slug = project.Slug,
            Summary = project.Summary,
            Description = project.Description,
            ThumbnailUrl = project.ThumbnailUrl,
            RepositoryUrl = project.RepositoryUrl,
            DemoUrl = project.DemoUrl,
            IsFeatured = project.IsFeatured,
            CreatedAt = project.CreatedAt,
            Tags = project.Tags.Select(t => t.Name).ToList()
        };

        return CreatedAtAction(nameof(GetProjects), new { id = project.Id }, resultDto);
    }

    // PUT: api/projects/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, UpdateProjectDto dto)
    {
        var project = await context.Projects
            .Include(p => p.Tags)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
        {
            return NotFound(new { message = $"Proyek dengan ID '{id}' tidak ditemukan." });
        }

        project.Title = dto.Title.Trim();
        project.Summary = dto.Summary.Trim();
        project.Description = dto.Description.Trim();
        project.ThumbnailUrl = dto.ThumbnailUrl.Trim();
        project.RepositoryUrl = string.IsNullOrWhiteSpace(dto.RepositoryUrl) ? null : dto.RepositoryUrl.Trim();
        project.DemoUrl = string.IsNullOrWhiteSpace(dto.DemoUrl) ? null : dto.DemoUrl.Trim();
        project.IsFeatured = dto.IsFeatured;

        // Ambil input dan sanitasi ketat simbol '#' serta spasi kosong
        var rawInput = (dto.TagNames != null && dto.TagNames.Count > 0 ? dto.TagNames : dto.Tags) ?? new List<string>();

        var cleanTagNames = rawInput
            .Select(t => t.Trim().TrimStart('#').Trim())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var targetSlugs = cleanTagNames
            .Select(t => t.ToLower().Replace(" ", "-"))
            .ToHashSet();

        // 1. Lepas asosiasi tag yang dihapus pengguna
        var tagsToRemove = project.Tags
            .Where(t => !targetSlugs.Contains(t.Slug))
            .ToList();

        foreach (var tag in tagsToRemove)
        {
            project.Tags.Remove(tag);
        }

        // 2. Tambahkan tag baru yang belum terhubung
        var currentSlugs = project.Tags.Select(t => t.Slug).ToHashSet();

        foreach (var name in cleanTagNames)
        {
            var slug = name.ToLower().Replace(" ", "-");
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

            project.Tags.Add(existingTag);
        }

        await context.SaveChangesAsync();

        return Ok(new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Slug = project.Slug,
            Summary = project.Summary,
            Description = project.Description,
            ThumbnailUrl = project.ThumbnailUrl,
            RepositoryUrl = project.RepositoryUrl,
            DemoUrl = project.DemoUrl,
            IsFeatured = project.IsFeatured,
            CreatedAt = project.CreatedAt,
            Tags = project.Tags
                .Select(t => t.Name)
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .ToList()
        });
    }
    
    // DELETE: api/projects/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var project = await context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound(new { message = $"Proyek dengan ID '{id}' tidak ditemukan." });
        }

        context.Projects.Remove(project);
        await context.SaveChangesAsync();

        return NoContent();
    }
}