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

    // POST: api/upload/cv (Hanya Admin yang bisa upload)
    [Authorize]
    [HttpPost("cv")]
    public async Task<IActionResult> UploadCv(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Tidak ada berkas PDF yang dipilih." });
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".pdf")
        {
            return BadRequest(new { message = "Format berkas harus berupa dokumen PDF (.pdf)." });
        }

        // Batasi ukuran PDF maksimal 10 MB
        if (file.Length > 10 * 1024 * 1024)
        {
            return BadRequest(new { message = "Ukuran berkas CV maksimal 10MB." });
        }

        var docsFolder = Path.Combine(env.ContentRootPath, "wwwroot", "docs");
        if (!Directory.Exists(docsFolder))
        {
            Directory.CreateDirectory(docsFolder);
        }

        // Simpan dengan nama tetap agar selalu menimpa versi lama
        var filePath = Path.Combine(docsFolder, "rizky-fajar-maulana-cv.pdf");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var lastModified = DateTime.UtcNow.Ticks;

        return Ok(new
        {
            url = $"{baseUrl}/docs/rizky-fajar-maulana-cv.pdf?v={lastModified}",
            updatedAt = DateTime.UtcNow
        });
    }

    // GET: api/upload/cv (Publik - Mengambil URL CV aktif)
    [AllowAnonymous] // Tambahkan atribut ini agar pengunjung umum di /about dapat mengakses CV
    [HttpGet("cv")]
    public IActionResult GetCvStatus()
    {
        var filePath = Path.Combine(env.ContentRootPath, "wwwroot", "docs", "rizky-fajar-maulana-cv.pdf");
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound(new { message = "CV belum diunggah." });
        }

        var fileInfo = new FileInfo(filePath);
        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";

        return Ok(new
        {
            url = $"{baseUrl}/docs/rizky-fajar-maulana-cv.pdf?v={fileInfo.LastWriteTimeUtc.Ticks}",
            updatedAt = fileInfo.LastWriteTimeUtc
        });
    }
}