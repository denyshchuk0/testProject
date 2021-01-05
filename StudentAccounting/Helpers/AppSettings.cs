namespace StudentAccounting.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public int allUsersCount { get; set; }
        public int allCoursesCount { get; set; }
        public int pageCoursesSize { get; set; }
        public int pageUsersSize { get; set; }
        public string EmailFrom { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUser { get; set; }
        public string SmtpPassword { get; set; }
        public string MessageSubject { get; set; }
        public string MessageBody { get; set; }
    }
}
