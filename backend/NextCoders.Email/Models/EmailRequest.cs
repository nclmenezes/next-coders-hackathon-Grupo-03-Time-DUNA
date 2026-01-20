namespace NextCoders.Email.Models;

public class EmailRequest
{
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public List<string> Recipients { get; set; } = new();
    public EmailTypeEnum Type { get; set; } = EmailTypeEnum.Communication;
}

public enum EmailTypeEnum
{
    Communication = 1,
    Notification = 2,
    Marketing = 3
}
