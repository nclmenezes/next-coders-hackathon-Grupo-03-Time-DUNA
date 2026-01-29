using Microsoft.EntityFrameworkCore;
using NextCoders.Email.Services;
using NextCoders.Email.Data;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
string host = Environment.GetEnvironmentVariable("DB_HOST");
string port = Environment.GetEnvironmentVariable("DB_PORT");
string name = Environment.GetEnvironmentVariable("DB_NAME");
string user = Environment.GetEnvironmentVariable("DB_USER");
string pass = Environment.GetEnvironmentVariable("DB_PASSWORD");

string connectionString = $"Server={host};Port={port};Database={name};User={user};Password={pass}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "NextCoders Email API", Version = "v1" });
});

// Register email service implementation
builder.Services.AddScoped<IEmailService, EmailService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "NextCoders Email API v1");
});

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowAll");
app.MapControllers();

Console.WriteLine("🚀 NextCoders Email API (Mock Mode) is running!");
Console.WriteLine("📧 Swagger UI: https://localhost:7071/swagger");

app.Run();