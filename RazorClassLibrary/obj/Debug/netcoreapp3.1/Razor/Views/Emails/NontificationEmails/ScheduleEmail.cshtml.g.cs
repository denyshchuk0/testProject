#pragma checksum "C:\Users\denys\OneDrive\Рабочий стол\my\testProject\RazorClassLibrary\Views\Emails\NontificationEmails\ScheduleEmail.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "42db17da12c92bac367707445764539d3b974844"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Emails_NontificationEmails_ScheduleEmail), @"mvc.1.0.view", @"/Views/Emails/NontificationEmails/ScheduleEmail.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\denys\OneDrive\Рабочий стол\my\testProject\RazorClassLibrary\Views\Emails\NontificationEmails\ScheduleEmail.cshtml"
using RazorClassLibrary.Views;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\denys\OneDrive\Рабочий стол\my\testProject\RazorClassLibrary\Views\Emails\NontificationEmails\ScheduleEmail.cshtml"
using RazorClassLibrary.Views.Emails.NontificationEmails;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"42db17da12c92bac367707445764539d3b974844", @"/Views/Emails/NontificationEmails/ScheduleEmail.cshtml")]
    public class Views_Emails_NontificationEmails_ScheduleEmail : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<ScheduleEmailViewModel>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
#nullable restore
#line 5 "C:\Users\denys\OneDrive\Рабочий стол\my\testProject\RazorClassLibrary\Views\Emails\NontificationEmails\ScheduleEmail.cshtml"
  
    ViewData["EmailTitle"] = "Attention!";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n<p>\r\n    You have signed up for the course. Read carefully what is written below.\r\n</p>\r\n\r\n<br />\r\n<p><h2>");
#nullable restore
#line 14 "C:\Users\denys\OneDrive\Рабочий стол\my\testProject\RazorClassLibrary\Views\Emails\NontificationEmails\ScheduleEmail.cshtml"
  Write(Model.Message);

#line default
#line hidden
#nullable disable
            WriteLiteral("</h2></p>\r\n<br />\r\n\r\n\r\n<p>\r\n    If you have any questions, just reply to this email—we\'re always happy to help out.\r\n</p>\r\n\r\n<br />\r\n\r\n<p>\r\n    Student Accounting Services\r\n</p>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<ScheduleEmailViewModel> Html { get; private set; }
    }
}
#pragma warning restore 1591
