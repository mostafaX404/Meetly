


using System.Net;
using System.Text.Json;

public class ExceptionMiddleware(RequestDelegate next ,
 ILogger<ExceptionMiddleware> logger , IHostEnvironment env)
{
    

    public async Task Invoke(HttpContext context )
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            //1. log the error in terminal 
            logger.LogError(ex,"{message}",ex.Message);
            
            //2.status code & type
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            //3.prepare response 
            var response = env.IsDevelopment()? 
            new ApiException(context.Response.StatusCode,ex.Message,ex.StackTrace)
            : new ApiException(context.Response.StatusCode,ex.Message,"Internal Server Error");

            //4. write it in json response

            var options = new JsonSerializerOptions{
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response,options);

            await context.Response.WriteAsync(json);
        }
    }


}