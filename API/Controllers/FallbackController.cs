using Microsoft.AspNetCore.Mvc;

public class FallbackController : Controller
{

    public ActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
    }
}