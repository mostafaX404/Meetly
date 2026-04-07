
using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? 
        throw new Exception("Cannot get the id from token ");
    }
}