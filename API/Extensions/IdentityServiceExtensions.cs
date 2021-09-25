using Core.Entities.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace API.Extensions
{
  public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config) 
        {
            //create identity builder
            // var builder = services.AddIdentityCore<AppUser>();
            // builder = new IdentityBuilder( builder.UserType ,builder.Services);

            // //designate identity database to store identity tables - identity can use a different data store            
            // builder.AddEntityFrameworkStores<AppIdentityDbContext>(); 
            // builder.AddSignInManager<SignInManager<AppUser>>();

            services.AddIdentityCore<AppUser>()
                .AddEntityFrameworkStores<AppIdentityDbContext>()
                .AddSignInManager<SignInManager<AppUser>>();          

            //sign-in manager relies on authentication service, so we also need to add it
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer( options => 
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        //tell identity how to validate the token - check key & issuer
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])),
                        ValidIssuer = config["Token:Issuer"],
                        ValidateIssuer = true,
                        ValidateAudience = false
                    };
                });

            return services;
        }


    }
}