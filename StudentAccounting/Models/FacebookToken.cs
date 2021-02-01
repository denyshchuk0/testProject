using System.ComponentModel.DataAnnotations;

namespace StudentAccounting.Models
{
    public class FacebookToken
    {
        [Required]
        public string Token { get; set; }
    }
}
