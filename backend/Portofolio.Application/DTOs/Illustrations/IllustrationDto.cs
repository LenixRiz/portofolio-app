namespace Portofolio.Application.DTOs.Illustrations;
    
public class IllustrationDto
{
    // Read data untuk ditampilkan
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<string> Tags { get; set; } = new();
}