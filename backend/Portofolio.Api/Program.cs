using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Portofolio.Application.Common.Interfaces;
using Portofolio.Infrastructure.Services;
using Portofolio.Infrastructure.Persistence;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Cukup daftarkan controllers satu kali saja
builder.Services.AddControllers();

// Daftarkan DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// OpenAPI bawaan .NET 9 (AddEndpointsApiExplorer dihapus karena sudah tidak wajib)
builder.Services.AddOpenApi();

// Konfigurasi JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? throw new InvalidOperationException("JWT Key belum dikonfigurasi di appsettings.json");

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Konfigurasi Policy Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    // Status kode ketika limit terlampaui
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Respon JSON yang rapi dan informatif saat diblokir
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        await context.HttpContext.Response.WriteAsync(
            "{\"message\": \"Terlalu banyak permintaan pengiriman pesan. Mohon tunggu beberapa menit sebelum mencoba kembali.\"}",
            token);
    };

    // Kebijakan khusus formulir kontak: Maksimal 3 request per 10 menit per IP
    options.AddPolicy("contact-form-limit", httpContext =>
    {
        // Ambil IP klien (kompatibel dengan reverse proxy Docker/Nginx nanti)
        var clientIp = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                       ?? httpContext.Connection.RemoteIpAddress?.ToString()
                       ?? "anonymous";

        return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 3,
            Window = TimeSpan.FromMinutes(10),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0 // Langsung tolak tanpa antrean memori
        });
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // URL dokumentasi: /scalar/v1
}


// 2. Aktifkan CORS di urutan yang tepat sebelum Authorization
app.UseCors("AllowFrontend");
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRateLimiter();

app.UseStaticFiles(); // AGAR FOLDER WWWROOT/UPLOADS BISA DIAKSES PUBLIK

app.UseAuthentication(); // 1. Autentikasi (Identifikasi identitas token)
app.UseAuthorization();  // 2. Otorisasi (Evaluasi hak akses)

app.MapControllers();

app.Run();