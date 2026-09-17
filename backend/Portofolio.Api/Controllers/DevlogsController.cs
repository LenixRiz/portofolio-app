using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Application.DTOs.Devlogs;
using Portofolio.Domain.Entities;
using Portofolio.Infrastructure.Persistence;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevlogsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/devlogs?projectId={guid}
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DevlogDto>>> GetDevlogs([FromQuery] Guid? projectId = null)
    {
        var query = context.Devlogs
            .Include(d => d.Project)
            .Include(d => d.Tags)
            .AsNoTracking(); // Optimasi performa: query read-only tidak perlu tracking EF

        // Filter opsional jika frontend ingin menampilkan devlog dari proyek tertentu
        if (projectId.HasValue)
        {
            query = query.Where(d => d.ProjectId == projectId.Value);
        }

        var devlogs = await query
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

        return Ok(devlogs);
    }

    // GET: api/devlogs/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<DevlogDto>> GetDevlogBySlug(string slug)
    {
        var devlog = await context.Devlogs
            .Include(d => d.Project)
            .Include(d => d.Tags)
            .AsNoTracking()
            .Where(d => d.Slug == slug.ToLower())
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
            .FirstOrDefaultAsync();

        if (devlog == null)
        {
            return NotFound(new { message = $"Devlog dengan slug '{slug}' tidak ditemukan." });
        }

        return Ok(devlog);
    }

    // POST: api/devlogs
    [HttpPost]
    public async Task<ActionResult<DevlogDto>> CreateDevlog(CreateDevlogDto dto)
    {
        // 1. Validasi Integritas Relasi: Pastikan Project induk benar-benar ada
        var project = await context.Projects.FindAsync(dto.ProjectId);
        if (project == null)
        {
            return NotFound(new { message = $"Project dengan ID '{dto.ProjectId}' tidak ditemukan." });
        }

        // 2. Generate dan validasi keunikan Slug
        var slug = dto.Title.Trim().ToLower().Replace(" ", "-");
        if (await context.Devlogs.AnyAsync(d => d.Slug == slug))
        {
            return BadRequest(new { message = "Devlog dengan judul/slug tersebut sudah terdaftar." });
        }

        var devlog = new Devlog
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            IsPublished = dto.IsPublished,
            ProjectId = dto.ProjectId
        };

        // 3. Sinkronisasi Tags (Unified Tagging)
        foreach (var tagName in dto.TagNames)
        {
            var cleanName = tagName.Trim();
            var tagSlug = cleanName.ToLower().Replace(" ", "-");

            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
            if (existingTag == null)
            {
                existingTag = new Tag { Name = cleanName, Slug = tagSlug };
                context.Tags.Add(existingTag);
            }

            devlog.Tags.Add(existingTag);
        }

        context.Devlogs.Add(devlog);
        await context.SaveChangesAsync();

        var resultDto = new DevlogDto
        {
            Id = devlog.Id,
            Title = devlog.Title,
            Slug = devlog.Slug,
            Content = devlog.Content,
            IsPublished = devlog.IsPublished,
            CreatedAt = devlog.CreatedAt,
            ProjectId = devlog.ProjectId,
            ProjectTitle = project.Title,
            Tags = devlog.Tags.Select(t => t.Name).ToList()
        };

        return CreatedAtAction(nameof(GetDevlogBySlug), new { slug = devlog.Slug }, resultDto);
    }
}