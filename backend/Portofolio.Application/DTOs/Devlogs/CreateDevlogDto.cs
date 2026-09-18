using System.ComponentModel.DataAnnotations;

namespace Portofolio.Application.DTOs.Devlogs;

public class CreateDevlogDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = false;

    [Required]
    public Guid ProjectId { get; set; }

    // Gunakan auto-property { get; set; } agar data array JSON berhasil di-deserialize
    public List<string> TagNames { get; set; } = new();
}