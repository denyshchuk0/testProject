namespace StudentAccounting.Models
{
    public class PageListModel
    {
        const int maxPageSize = 20;
        public int PageNumber { get; set; } = 1;

        public int pageSize = 5;
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
