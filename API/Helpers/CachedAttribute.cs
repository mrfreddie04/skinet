using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace API.Helpers
{
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveSeconds;
        public CachedAttribute(int timeToLiveSeconds)
        {
            _timeToLiveSeconds = timeToLiveSeconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

            //generate unique key for a query - url+qs+params
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);

            var cachedResponse = await cacheService.GetCachedResponseAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedResponse))
            {
                var contentResult = new ContentResult()
                {
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResult;                
                return; //return result from cache to HttpResponse, do no call next (suppress execution of the endpoint)
            }

            var executedContext = await next(); //move execution to the controller
            
            if(executedContext.Result is OkObjectResult okObjectResult)
            {
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_timeToLiveSeconds));
            }            
  
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request) 
        {
            var keyBuilder = new StringBuilder();
            keyBuilder.Append($"{request.Path}");
            foreach(var item in request.Query.OrderBy(q => q.Key))
            {
                keyBuilder.Append($"|{item.Key}-{item.Value}");
            }
            return keyBuilder.ToString();
        }
    }
}