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
            .Include(p => p.Tags) //Eager Loading: ambil relasi tag sekaligus
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

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto dto)
    {
        // Generate slug sederhana dari judul (ex: "Game RPG" -> "game-rpg")
        var slug = dto.Title.Trim().ToLower().Replace(" ", "-");

        // Cek duplikasi slug
        if (await context.Projects.AnyAsync(p => p.Slug == slug))
        {
            return BadRequest(new { message = "Proyek dengan judul/slug tersebut sudah ada."});
        }

        var project = new Project
        {
            Title = dto.Title,
            Slug = slug,
            Summary = dto.Summary,
            Description = dto.Description,
            ThumbnailUrl = dto.ThumbnailUrl,
            RepositoryUrl = dto.RepositoryUrl,
            DemoUrl = dto.DemoUrl,
            IsFeatured = dto.IsFeatured
        };

        // Sinkronisasi tag yang sudah ada atau buat baru jika belum terdaftar
        foreach (var name in dto.TagNames)
        {
            var cleanName = name.Trim();
            var tagSlug = cleanName.ToLower().Replace(" ", "-");

            var existingTag = await context.Tags.FirstOrDefaultAsync(t => t.Slug == tagSlug);
            if (existingTag == null)
            {
                existingTag = new Tag { Name = cleanName, Slug = tagSlug};
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

        return CreatedAtAction(nameof(GetProjects), new {id = project.Id}, resultDto);
    }
}