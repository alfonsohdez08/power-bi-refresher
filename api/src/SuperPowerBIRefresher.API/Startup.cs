using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SuperPowerBIRefresher.API.Hubs;
using SuperPowerBIRefresher.API.Models;

namespace SuperPowerBIRefresher.API
{
    public class Startup
    {
        private const string CorsPolicyName = "Super_Cors_Policy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            string corsOrigin = Configuration.GetValue<string>("AllowedOrigin");
            services.AddCors(corsOptions =>
            {
                corsOptions.AddPolicy(CorsPolicyName, corsPolicyBuilder =>
                {
                    corsPolicyBuilder.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins(corsOrigin);
                });
            });

            var powerBiConfig = new PowerBiConfiguration();
            Configuration.GetSection("PowerBiConfiguration").Bind(powerBiConfig);

            services.AddSingleton(typeof(PowerBiConfiguration), powerBiConfig);

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            
            app.UseCors(CorsPolicyName);

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ClientHub>("/client-hub");
            });
        }
    }
}
