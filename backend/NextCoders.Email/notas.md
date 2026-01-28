// Método chamado via POST na rota "criar"
[HttpPost("criar")]  
public async Task<IActionResult> CreateEmail([FromBody] EmailRequest request)  
{
    try
    {
        // Valida se o tipo de e-mail existe no enum
        if (!Enum.IsDefined(typeof(EmailTypeEnum), request.Type))
            return StatusCode(400, "Invalid email type.");

        // Tenta enviar o e-mail pelo serviço
        var response = await _emailService.SendEmail(request);

        // Log simples no console
        Console.WriteLine("Message successfully sent");

        // Retorna 200 se sucesso, 400 se falhou
        return !response ? StatusCode(400, "Could not send the email") : StatusCode(200, "Email sent successfully");
    }
    catch (Exception ex)
    {
        // Log de erro no console
        Console.WriteLine($"Error while trying to send email: {ex.Message}");

        // Retorna 500 em caso de exceção
        return StatusCode(500, $"Error sending email: {ex.Message}");
    }
}