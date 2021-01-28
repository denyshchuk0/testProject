using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Models
{
    public class PageListModel
    {
        public int currentPage { get; set; }
        public string sortOrder { get; set; }
        public string sortParameter { get; set; }
    }
}
