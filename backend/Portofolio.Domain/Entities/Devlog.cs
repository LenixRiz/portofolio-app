namespace Portofolio.Domain.Entities;

public class Devlog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsPublished { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid ProjectId { get; set; }
    public Project Project { get; set;} = null!;

    public ICollection<Tag> Tags = new List<Tag>();
}