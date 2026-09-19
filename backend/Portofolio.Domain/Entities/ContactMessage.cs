namespace Portofolio.Domain.Entities;

public class ContactMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // General, Project Inquiry, Art Commission
    public string Message { get; set; } = string.Empty;
    public string? Budget { get; set; } // Estimasi budget jika commission/project
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}