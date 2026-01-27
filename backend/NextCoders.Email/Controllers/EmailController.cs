using Microsoft.AspNetCore.Mvc;
using NextCoders.Email.Models;
using NextCoders.Email.Services;
using NextCoders.Email.Data;

namespace NextCoders.Email.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IEmailService _emailService;

    public EmailController(AppDbContext appDbContext, IEmailService emailService)
    {
        _appDbContext = appDbContext;
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        try
        {
            if (!Enum.IsDefined(typeof(EmailTypeEnum), request.Type))
                return StatusCode(400, "Invalid email type.");

            var response = await _emailService.SendEmail(request);
            Console.WriteLine("Message successfully sent");
            return !response ? StatusCode(400, "Could not send the email") : StatusCode(200, "Email sent successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while trying to send email: {ex.Message}");
            return StatusCode(500, $"Error sending email: {ex.Message}");
        }
    }
    
    [HttpPost("Communication")]
    public async Task<IActionResult> SendCommunication([FromBody] EmailRequest request)
    {
        try
        {
            if (!Enum.IsDefined(typeof(EmailTypeEnum), request.Type))
                return StatusCode(400, "Invalid email type.");

            var response = await _emailService.SendCommunication(request);
            Console.WriteLine("Message successfully sent");
            return !response ? StatusCode(400, "Could not send the email") : StatusCode(200, "Email sent successfully");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while trying to send email: {ex.Message}");
            return StatusCode(500, $"Error sending email: {ex.Message}");
        }
    }
    
    [HttpGet]
    public async Task<IActionResult> GetEmails()
    {
        try
        {
            var response = await _emailService.GetEmails();
            return response is null ? StatusCode(400, "Could not fetch emails") : StatusCode(200, response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while trying to get emails: {ex.Message}");
            return StatusCode(500, $"Error fetching emails: {ex.Message}");
        }
    }
}