using System.ComponentModel.DataAnnotations;

namespace StudentAccounting.Models
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}
