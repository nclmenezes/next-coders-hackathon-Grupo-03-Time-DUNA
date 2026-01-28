using NextCoders.Email.Models;

namespace NextCoders.Email.Services;

public interface IEmailService
{
    Task<bool> SendEmail(EmailRequest request);
    Task<bool> SendCommunication(EmailRequest request);
    Task<List<EmailResponse>> GetEmails();
    Task<List<EmailLog>> GetEmailsSent();
    Task<EmailResponse> AddEmail(EmailResponse email);
    Task<bool> UpdateRegister(int id, EmailResponse email);
    Task<bool> DeleteRegister(int id);
    Task<List<EmailResponse>> SearchEmails(string searchTerm);
}