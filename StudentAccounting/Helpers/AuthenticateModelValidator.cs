using FluentValidation;
using StudentAccounting.Models;

namespace StudentAccounting.Helpers
{
    public class AuthenticateModelValidator : AbstractValidator<AuthenticateModel>
    {
        public AuthenticateModelValidator()
        {
            RuleFor(model => model.Email).EmailAddress().WithMessage("Incorrect email");
            RuleFor(model => model.Password).MinimumLength(6).WithMessage("Minimum length 6 symbols");
        }
    }
}
