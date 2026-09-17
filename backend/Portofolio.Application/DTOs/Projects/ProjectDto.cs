namespace Portofolio.Application.DTOs.Projects;

public class ProjectDto
{
    // Respon baca data untuk frontend
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<string> Tags { get; set; } = new();
}