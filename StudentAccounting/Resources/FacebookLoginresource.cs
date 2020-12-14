using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Resources
{
    public class FacebookLoginResource
    {
        [Required]
        [StringLength(255)]
        public string facebookToken { get; set; }
        [Required]
        [StringLength(255)]
        public string DeviceId { get; set; }
        [Required]
        [StringLength(255)]
        public string DeviceName { get; set; }
    }
}
