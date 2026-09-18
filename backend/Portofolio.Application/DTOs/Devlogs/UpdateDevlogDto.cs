namespace Portofolio.Application.DTOs.Devlogs;

public class UpdateDevlogDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public Guid ProjectId { get; set; }

    public List<string> TagNames { get; set; } = new();
    public List<string>? Tags { get; set; }
}