namespace Portofolio.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }= Guid.NewGuid();
    public string Title { get; set; }= string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? RepositoryUrl { get; set; }
    public string? DemoUrl { get; set; }
    public bool IsFeatured { get; set; } = false;
    public bool IsOnGoing { get; set; } = false;
    public bool IsFinished { get; set; } = false;
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    public ICollection<Devlog> Devlogs { get; set; } = new List<Devlog>();
}