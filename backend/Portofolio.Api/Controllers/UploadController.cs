using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portofolio.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadController(IWebHostEnvironment env) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Tidak ada berkas gambar yang dipilih." });
        }

        // 1. Validasi ekstensi format berkas
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." });
        }

        // 2. Batasi ukuran maksimum (misal 5 MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "Ukuran file terlalu besar. Maksimum 5MB." });
        }

        // 3. Tentukan direktori tujuan: backend/Portofolio.Api/wwwroot/uploads
        var uploadsFolder = Path.Combine(env.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        // 4. Buat nama unik agar tidak terjadi bentrok nama file
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 5. Susun URL publik berdasar domain server saat ini
        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";

        return Ok(new { url = fileUrl });
    }
}