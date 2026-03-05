using Advance_Batch_Loader.Services;
using OfficeOpenXml;

var builder = WebApplication.CreateBuilder(args);
ExcelPackage.License.SetNonCommercialPersonal("Advance Batch Loader");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ArasConnectionService>();
builder.Services.AddScoped<ExcelService>();
builder.Services.AddScoped<ImportService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");

app.UseAuthorization();

app.MapControllers();

app.Run();
