namespace Portofolio.Application.DTOs.Projects;

public class UpdateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; }

    public List<string> TagNames { get; set; } = new();
    public List<string>? Tags { get; set; } // Fallback jika payload dikirim dengan nama "tags"
}