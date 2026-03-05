

using API.Controllers;
using Microsoft.AspNetCore.Mvc;

public class BuggyController : BaseApiController
{

    [HttpGet("auth")]
    public IActionResult GetAuth()
    {
        return Unauthorized();
    }

    [HttpGet("not-found")]

    public IActionResult GetNotFound()
    {
        return NotFound();
    }


    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("There is server error !");
    }



    [HttpGet("bad-request")]
    public IActionResult GetBadrequest()
    {
        return BadRequest();
    }

    
    

}