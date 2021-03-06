using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services) 
        {
            services.AddScoped<IOrderService,OrderService>();
            services.AddScoped<IPaymentService,PaymentService>();            
            services.AddScoped<IProductRepository,ProductRepository>();
            services.AddScoped(typeof(IGenericRepository<>),typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork,UnitOfWork>();
            services.AddScoped<IBasketRepository,BasketRepository>();
            services.AddScoped<ITokenService,TokenService>();

            //has to be singleton??? to be shared by requests, but... 
            services.AddSingleton<IResponseCacheService,ResponseCacheService>();

            services.Configure<ApiBehaviorOptions>( opt => {
                opt.InvalidModelStateResponseFactory = actionContext => 
                {
                    //transforms ModelState dictionary to a fla arrya of error messages
                    var errors = actionContext.ModelState
                        .Where( e => e.Value.Errors.Count > 0)
                        .SelectMany( e => e.Value.Errors )
                        .Select( e => e.ErrorMessage)
                        .ToArray();
                    
                    var errorResponse = new ApiValidationErrorResponse() {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });            

            return services;
        }
    }
}