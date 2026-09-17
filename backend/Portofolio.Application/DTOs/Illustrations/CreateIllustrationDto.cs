using System.ComponentModel.DataAnnotations;

namespace Portofolio.Application.DTOs.Illustrations;
    
public class CreateIllustrationDto
{
    // Input data
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required]
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public DateTime? CompletedAt { get; set; }

    public List<string> TagNames { get; set; } = new();
}