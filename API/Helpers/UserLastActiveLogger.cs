using API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

public class UserLastActiveLogger : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        
        var result = await next();

       if (result.HttpContext.User.Identity?.IsAuthenticated != true) return;


        var memberId = result.HttpContext.User.GetMemberId();

        var Dbcontext = result.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        await Dbcontext.Members.Where(m=>m.Id == memberId).ExecuteUpdateAsync(setters => setters.SetProperty(m=>m.LastActive , DateTime.UtcNow));

    }
}