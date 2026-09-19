using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portofolio.Application.Common.Interfaces;
using Portofolio.Application.DTOs.Messages;
using Portofolio.Domain.Entities;
using Portofolio.Infrastructure.Persistence;

namespace Portofolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController(ApplicationDbContext context, IEmailService emailService) : ControllerBase
{
    // POST: api/messages (Publik - Pengunjung mengirim inquiry)
    [HttpPost]
    public async Task<ActionResult<ContactMessageDto>> SendMessage(CreateContactMessageDto dto)
    {
        var message = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Subject = dto.Subject.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? "General" : dto.Category.Trim(),
            Message = dto.Message.Trim(),
            Budget = string.IsNullOrWhiteSpace(dto.Budget) ? null : dto.Budget.Trim(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        // 1. Simpan ke database terlebih dahulu
        context.ContactMessages.Add(message);
        await context.SaveChangesAsync();

        // 2. Kirim notifikasi email (Asinkron)
        // Jika internet SMTP gagal, fungsi ini menangani error di internal logger
        // sehingga user tetap menerima status sukses bahwa pesan mereka telah diterima.
        await emailService.SendNewMessageNotificationAsync(message);

        return Ok(new ContactMessageDto
        {
            Id = message.Id,
            Name = message.Name,
            Email = message.Email,
            Subject = message.Subject,
            Category = message.Category,
            Message = message.Message,
            Budget = message.Budget,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        });
    }

    // GET: api/messages (Admin Saja - Membaca semua pesan)
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessageDto>>> GetAllMessages()
    {
        var messages = await context.ContactMessages
            .AsNoTracking()
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => new ContactMessageDto
            {
                Id = m.Id,
                Name = m.Name,
                Email = m.Email,
                Subject = m.Subject,
                Category = m.Category,
                Message = m.Message,
                Budget = m.Budget,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    // PATCH: api/messages/{id}/toggle-read (Admin Saja - Menandai sudah/belum dibaca)
    [Authorize]
    [HttpPatch("{id}/toggle-read")]
    public async Task<IActionResult> ToggleRead(Guid id)
    {
        var message = await context.ContactMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound(new { message = "Pesan tidak ditemukan." });
        }

        message.IsRead = !message.IsRead;
        await context.SaveChangesAsync();

        return Ok(new { isRead = message.IsRead });
    }

    // DELETE: api/messages/{id} (Admin Saja - Menghapus pesan)
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var message = await context.ContactMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound(new { message = "Pesan tidak ditemukan." });
        }

        context.ContactMessages.Remove(message);
        await context.SaveChangesAsync();

        return NoContent();
    }
}