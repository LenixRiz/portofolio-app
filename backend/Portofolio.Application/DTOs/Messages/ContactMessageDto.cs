namespace Portofolio.Application.DTOs.Messages;

public class ContactMessageDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Budget { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}