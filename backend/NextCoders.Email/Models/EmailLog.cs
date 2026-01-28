using System;

namespace NextCoders.Email.Models
{
    public class EmailLog
    {
        public int Id { get; set; }
        public string Recipient { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } // Data e hora do envio
        public bool Success { get; set; }
    }
}