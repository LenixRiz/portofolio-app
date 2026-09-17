namespace Portofolio.Application.DTOs.Devlogs;

public class DevlogDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid ProjectId { get; set; }
    public string? ProjectTitle { get; set; } // Tambahan opsional namun sangat praktis agar frontend tahu nama proyek induknya

    // Gunakan auto-property { get; set; } agar terbaca oleh System.Text.Json
    public List<string> Tags { get; set; } = new();
}