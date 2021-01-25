
namespace RazorClassLibrary.Views.Emails.NontificationEmails
{
    public class ScheduleEmailViewModel
    {
        public ScheduleEmailViewModel(string message)
        {
            Message = message;
        }

        public string Message { get; set; }

    }

}
