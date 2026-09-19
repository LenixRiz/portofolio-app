using System.ComponentModel.DataAnnotations;

namespace Portofolio.Application.DTOs.Projects;

public class CreateProjectDto
{
    // Input data ketika membuat proyek baru
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Summary { get; set; } = string.Empty;
    [Required]
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsOnGoing { get; set; }
    public bool IsFinished { get; set; }

    public List<string> TagNames { get; set; } = new();
}