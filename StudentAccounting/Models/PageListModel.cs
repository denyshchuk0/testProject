using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAccounting.Models
{
    public class PageListModel
    {
        const int maxPageSize = 5;
        public int PageNumber { get; set; } = 1;

        public int pageSize = 2;
        public int PageSize
        {
            get
            {
                return pageSize;
            }
            set
            {
                pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }
        public string sortOrder { get; set; }
        public string sortParameter { get; set; }
    }
}
