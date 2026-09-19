using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using Portofolio.Application.Common.Interfaces;
using Portofolio.Domain.Entities;

namespace Portofolio.Infrastructure.Services;

public class EmailService(IConfiguration config, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendNewMessageNotificationAsync(ContactMessage message)
    {
        try
        {
            var smtpServer = config["EmailSettings:SmtpServer"];
            var port = int.Parse(config["EmailSettings:Port"] ?? "587");
            var senderName = config["EmailSettings:SenderName"];
            var senderEmail = config["EmailSettings:SenderEmail"];
            var senderPassword = config["EmailSettings:SenderPassword"];
            var receiverEmail = config["EmailSettings:ReceiverEmail"];

            if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(senderPassword))
            {
                logger.LogWarning("EmailSettings belum dikonfigurasi lengkap. Melewati pengiriman email.");
                return;
            }

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(new MailboxAddress("Admin Portfolio", receiverEmail));
            email.Subject = $"[Inquiry Baru] {message.Category}: {message.Subject}";

            // Format Email HTML yang Elegan dan Terstruktur
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $"""
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; color: #1f2937;">
                    <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 20px;">
                        <h2 style="color: #4f46e5; margin: 0; font-size: 20px;">Inquiry / Pesan Portofolio Baru</h2>
                        <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Pesan baru telah diterima dan tersimpan di database CMS.</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; width: 140px;"><strong>Pengirim:</strong></td>
                            <td style="padding: 8px 0; color: #111827;">{message.Name} (<a href="mailto:{message.Email}" style="color: #4f46e5;">{message.Email}</a>)</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Kategori:</strong></td>
                            <td style="padding: 8px 0; color: #111827;">
                                <span style="background-color: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">
                                    {message.Category}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Budget:</strong></td>
                            <td style="padding: 8px 0; color: #059669; font-weight: 600;">{message.Budget ?? "Tidak ditentukan"}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Subjek:</strong></td>
                            <td style="padding: 8px 0; color: #111827; font-weight: bold;">{message.Subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280;"><strong>Waktu:</strong></td>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 12px;">{message.CreatedAt:dd MMM yyyy, HH:mm} UTC</td>
                        </tr>
                    </table>

                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em;">Isi Pesan:</h4>
                        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1f2937;">{message.Message}</p>
                    </div>

                    <div style="text-align: center; margin-top: 24px;">
                        <a href="mailto:{message.Email}?subject=Re: {Uri.EscapeDataString(message.Subject)}" 
                           style="background-color: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                            Balas Langsung via Email ↗
                        </a>
                    </div>
                </div>
                """
            };

            email.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            // SecureSocketOptions.StartTls memastikan komunikasi terenkripsi via port 587
            await client.ConnectAsync(smtpServer, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(senderEmail, senderPassword);
            await client.SendAsync(email);
            await client.DisconnectAsync(true);

            logger.LogInformation("Notifikasi email untuk pesan dari {SenderEmail} berhasil dikirim.", message.Email);
        }
        catch (Exception ex)
        {
            // Catat log error tanpa melempar exception (agar request tidak 500)
            logger.LogError(ex, "Gagal mengirimkan notifikasi email untuk pesan ID {MessageId}.", message.Id);
        }
    }
}