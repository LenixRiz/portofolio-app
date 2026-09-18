namespace Portofolio.Application.DTOs.Illustrations;

public class UpdateIllustrationDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public DateTime? CompletedAt { get; set; }

    public List<string> TagNames { get; set; } = new();
    public List<string>? Tags { get; set; }
}