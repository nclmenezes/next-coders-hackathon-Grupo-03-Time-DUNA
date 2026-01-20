using NextCoders.Email.Models;

namespace NextCoders.Email.Services;

public class MockEmailService : IEmailService
{
    private static readonly List<EmailResponse> _mockEmails = new()
    {
        new() { Id = 1, Name = "Alice Silva", Email = "alice@school.com", Class = "Class A", Role = "Student" },
        new() { Id = 2, Name = "Bruno Santos", Email = "bruno@school.com", Class = "Class A", Role = "Student" },
        new() { Id = 3, Name = "Carla Oliveira", Email = "carla@school.com", Class = "Class B", Role = "Student" },
        new() { Id = 4, Name = "Daniel Costa", Email = "daniel@school.com", Class = "Class B", Role = "Student" },
        new() { Id = 5, Name = "Elena Rodrigues", Email = "elena@school.com", Class = "Class C", Role = "Student" },
        new() { Id = 6, Name = "Prof. Fernando Lima", Email = "fernando@school.com", Class = "All Classes", Role = "Teacher" },
        new() { Id = 7, Name = "Prof. Gabriela Pereira", Email = "gabriela@school.com", Class = "Class A", Role = "Teacher" },
        new() { Id = 8, Name = "Helena Martins", Email = "helena@school.com", Class = "Class C", Role = "Student" },
        new() { Id = 9, Name = "Igor Ferreira", Email = "igor@school.com", Class = "Class A", Role = "Student" },
        new() { Id = 10, Name = "Julia Almeida", Email = "julia@school.com", Class = "Class B", Role = "Student" },
        new() { Id = 11, Name = "Admin Maria", Email = "maria@school.com", Class = "Administration", Role = "Admin" },
        new() { Id = 12, Name = "Admin Paulo", Email = "paulo@school.com", Class = "Administration", Role = "Admin" }
    };

    public Task<bool> SendEmail(EmailRequest request)
    {
        // Simulate sending email
        Console.WriteLine($"[MOCK] Sending email to {request.Recipients.Count} recipients");
        Console.WriteLine($"[MOCK] Subject: {request.Subject}");
        Console.WriteLine($"[MOCK] Body: {request.Body}");
        
        // Simulate network delay
        return Task.FromResult(true);
    }

    public Task<bool> SendCommunication(EmailRequest request)
    {
        // Simulate sending communication
        Console.WriteLine($"[MOCK] Sending communication to {request.Recipients.Count} recipients");
        Console.WriteLine($"[MOCK] Subject: {request.Subject}");
        Console.WriteLine($"[MOCK] Body: {request.Body}");
        
        return Task.FromResult(true);
    }

    public Task<List<EmailResponse>> GetEmails()
    {
        return Task.FromResult(_mockEmails);
    }
}
