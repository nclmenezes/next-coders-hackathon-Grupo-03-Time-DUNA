using Microsoft.AspNetCore.Mvc;
using NextCoders.Domain.Enums;
using NextCoders.Domain.Interfaces.Services.Email;
using NextCoders.Domain.Requests.Email;
using Serilog;

namespace NextCoders.Email.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailSend _emailService;

    public EmailController(IEmailSend emailService)
    {
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        try
        {
            if (!Enum.IsDefined(typeof(EmailTypeEnum), request.Type))
                return StatusCode(400, "Tipo de e-mail não existe.");

            var response = await _emailService.SendEmail(request);
            Log.Information("Message successfully sent");
            return !response ? StatusCode(400, "Não foi possível realizar o envio do e-mail") : StatusCode(200, "E-mail enviado com sucesso");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while trying to send email");
            return StatusCode(500, $"Erro ao tentar enviar e-mail: {ex.Message}");
        }
    }
    
    [HttpPost("Communication")]
    public async Task<IActionResult> SendCommunication([FromBody] EmailRequest request)
    {
        try
        {
            if (!Enum.IsDefined(typeof(EmailTypeEnum), request.Type))
                return StatusCode(400, "Tipo de e-mail não existe.");

            var response = await _emailService.SendCommunication(request);
            Log.Information("Message successfully sent");
            return !response ? StatusCode(400, "Não foi possível realizar o envio do e-mail") : StatusCode(200, "E-mail enviado com sucesso");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while trying to send email");
            return StatusCode(500, $"Erro ao tentar enviar e-mail: {ex.Message}");
        }
    }
    
    [HttpGet]
    public async Task<IActionResult> GetEmails()
    {
        try
        {
            var response = await _emailService.GetEmails();
            return response is null ? StatusCode(400, "Não foi possível realizar a busca dos e-mails") : StatusCode(200, response);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while trying to get emails");
            return StatusCode(500, $"Erro ao tentar buscar e-mails: {ex.Message}");
        }
    }
}