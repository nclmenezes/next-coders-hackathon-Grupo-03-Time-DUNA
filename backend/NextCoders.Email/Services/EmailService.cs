using Microsoft.EntityFrameworkCore;
using NextCoders.Email.Models;
using NextCoders.Email.Services;
using NextCoders.Email.Data;

public class EmailService : IEmailService
{
    private readonly AppDbContext _context;

    public EmailService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<EmailResponse> AddEmail(EmailResponse email)
    {
        _context.Dbemails.Add(email); // Adiciona na fila do banco
        await _context.SaveChangesAsync(); // Salva e gera o ID
        return email;
    }

    public async Task<List<EmailLog>> GetEmailsSent()
    {
         return await _context.Emaillogs.ToListAsync();
    }

    public async Task<bool> UpdateRegister(int id, EmailResponse email)
{
   
    var existingEmail = await _context.Dbemails.FindAsync(id);
    if (existingEmail == null) return false;

    existingEmail.Name = email.Name;
    existingEmail.Email = email.Email;
    existingEmail.Class = email.Class;
    existingEmail.Role = email.Role;

    var result = await _context.SaveChangesAsync();
    
    return result > 0;
}
    public async Task<bool> DeleteRegister(int id)
    {
        var email = await _context.Dbemails.FindAsync(id);
        if (email == null) return false;

        _context.Dbemails.Remove(email);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<EmailResponse>> GetEmails()
    {
       return await _context.Dbemails.ToListAsync();
    }

    public async Task<bool> SendEmail(EmailRequest request)
    {
        bool isSuccess = false;
        try 
        {
            Console.WriteLine($"Enviando e-mail para {request.Recipients.Count} destinatários...");
            await Task.Delay(500); //simula envio real de rede
            isSuccess = true; 
            return isSuccess;
        }
        catch (Exception)
    {
        isSuccess = false;
        return isSuccess;
    }
    finally 
    {
        // INDEPENDENTE de dar erro ou sucesso, vamos registrar a tentativa no banco
        foreach (var recipient in request.Recipients)
        {
            var log = new EmailLog
            {
                Recipient = recipient,
                Subject = request.Subject,
                SentAt = DateTime.Now,
                Success = isSuccess
            };
            _context.Emaillogs.Add(log);
        }
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> SendCommunication(EmailRequest request)
    {
        // Mesma lógica do SendEmail
        Console.WriteLine($"Enviando comunicação: {request.Subject}");
        
        await Task.Delay(300); // Simula latência de rede
        
        return true;
    }

    public async Task<List<EmailResponse>> SearchEmails(string searchTerm)
{
    // Convertemos o termo buscado para não diferenciar letras maiúsculas de minúsculas
    var term = searchTerm.ToLower();

    return await _context.Dbemails
        .Where(e => e.Name.ToLower().Contains(term) || 
                    e.Email.ToLower().Contains(term) || 
                    e.Class.ToLower().Contains(term) ||
                    e.Role.ToLower().Contains(term))
        .ToListAsync();
}
}