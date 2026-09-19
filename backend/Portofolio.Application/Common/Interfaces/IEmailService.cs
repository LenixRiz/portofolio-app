using Portofolio.Domain.Entities;

namespace Portofolio.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendNewMessageNotificationAsync(ContactMessage message);
}