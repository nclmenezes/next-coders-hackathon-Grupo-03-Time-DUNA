using NextCoders.Domain.Models;
using NextCoders.Infra.IoC;
using NextCoders.Middleware;

var builder = WebApplication.CreateBuilder(args);
StartAPI(builder);

void StartAPI(WebApplicationBuilder builder)
{
    ConfigureServices(builder);

    var app = builder.Build();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.UseSwagger();
    app.UseAuthSwaggerConfiguration();
    app.UseAuthCorsConfiguration();
    app.UseHealthChecks("/health", HealthMiddleware.GetHealthCheckOptions(typeof(Program).Assembly));
    app.Run();

}


void ConfigureServices(WebApplicationBuilder builder)
{

    // Serilog
    builder.UseSerilogConfiguration();
    builder.Services.AddDbContext<NextCodersDbContext>();
    builder.Services.AddDbContext<NextCodersStudentDbContext>();
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddAuthCorsConfiguration();
    builder.Services.AddAuthSwaggerEmailConfiguration();
    builder.Services.AddHealthChecks();
    builder.Services.AddEmailSendServicesConfiguration(builder.Configuration);
    builder.Services.AddMassTransit(builder.Configuration);
    builder.Services.AddProviders();
}

