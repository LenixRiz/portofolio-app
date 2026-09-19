using System.ComponentModel.DataAnnotations;

namespace Portofolio.Application.DTOs.Messages;

public class CreateContactMessageDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    public string Category { get; set; } = "General";

    [Required, MinLength(10)]
    public string Message { get; set; } = string.Empty;

    public string? Budget { get; set; }
}