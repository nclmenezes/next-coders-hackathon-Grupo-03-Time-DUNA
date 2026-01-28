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
    
    [HttpPost("create")]
   public async Task<IActionResult> Create([FromBody] EmailResponse request)
    {
        try
        {
            var result = await _emailService.AddEmail(request);
            return StatusCode(201, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao criar: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromBody] EmailResponse request, int id)
    {
        try
        {
            var result = await _emailService.UpdateRegister(id, request);
            var updated = true;
            if (!updated) return NotFound("Registro não encontrado.");
            return Ok("Atualizado com sucesso");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao atualizar: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try 
        {
            // A service tenta deletar. Se deletar com sucesso, retorna true.
            var deleted = await _emailService.DeleteRegister(id);

            if (!deleted) return NotFound("ID não encontrado para exclusão.");
            return Ok("Removido com sucesso");
        }
        catch (Exception ex) 
        {
            return StatusCode(500, $"Erro ao deletar: {ex.Message}");
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string term)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest("O termo de busca não pode estar vazio.");

            var results = await _emailService.SearchEmails(term);
            
            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro na busca: {ex.Message}");
        }
    }

    [HttpGet("sent-emails")]
    public async Task<IActionResult> GetEmailsSent()
    {
        try
        {
            var response = await _emailService.GetEmailsSent();
            return response is null ? StatusCode(400, "Could not fetch emails") : StatusCode(200, response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while trying to get emails sent: {ex.Message}");
            return StatusCode(500, $"Error fetching sent emails: {ex.Message}");
        }
    }
}