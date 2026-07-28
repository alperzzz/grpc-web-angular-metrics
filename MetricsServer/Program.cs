using MetricsServer.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. gRPC ve CORS Servislerini Ekle
builder.Services.AddGrpc();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4200/")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Grpc-Status", "Grpc-Message", "Grpc-Encoding", "Grpc-Accept-Encoding", "X-Grpc-Web", "X-User-Agent");
    });
});

var app = builder.Build();

// 2. Middleware Sıralaması (Kritik!)
app.UseRouting();

// CORS'u yönlendirmeden hemen sonra çalıştırıyoruz
app.UseCors("AllowAngular");

// gRPC-Web Katmanı
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });

// 3. Endpoint Eşleme ve gRPC-Web Aktifleştirme
app.UseEndpoints(endpoints =>
{
    endpoints.MapGrpcService<MetricsService>()
             .EnableGrpcWeb()
             .RequireCors("AllowAngular");

    endpoints.MapGet("/", () => "gRPC-Web Metrics Server Çalışıyor!");
});

app.Run();