using NextCoders.Email.Models;

namespace NextCoders.Email.Services;

public interface IEmailService
{
    Task<bool> SendEmail(EmailRequest request);
    Task<bool> SendCommunication(EmailRequest request);
    Task<List<EmailResponse>> GetEmails();
}
