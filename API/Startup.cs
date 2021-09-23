using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Data;
using API.Helpers;
using API.Middleware;
using API.Extensions;
using StackExchange.Redis;

namespace API
{
  public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {                        

            //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddDbContext<StoreContext>( opt => {                
                opt.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            });

            services.AddSingleton<IConnectionMultiplexer>( services => {
                //Generic AddSingleton takes a Func<ISerProvider,T> argument (T= ConnectionMultiplexer)
                //Use a static Parse methos to create instance of ConfigurationOptions (from redis cnn string);
                var configuration = ConfigurationOptions.Parse(_config.GetConnectionString("RedisConnection"), true);
                //Use Connect() factory method to create ConnectionMultiplexer object    
                return ConnectionMultiplexer.Connect(configuration);
            });

            services.AddApplicationServices();

            services.AddSwaggerDocumentation();

            //services.AddCors();
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ExceptionMiddleware>();

            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            // app.UseCors(policy => policy
            //     .AllowAnyHeader()
            //     .AllowAnyMethod()
            //     .WithOrigins("https://localhost:4200"));            

            app.UseAuthorization();

            app.UseSwaggerDocumentation();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
