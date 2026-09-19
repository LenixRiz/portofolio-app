using System.Text;
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

app.UseStaticFiles(); // AGAR FOLDER WWWROOT/UPLOADS BISA DIAKSES PUBLIK

app.UseAuthentication(); // 1. Autentikasi (Identifikasi identitas token)
app.UseAuthorization();  // 2. Otorisasi (Evaluasi hak akses)

app.MapControllers();

app.Run();