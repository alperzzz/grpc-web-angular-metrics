using System.Diagnostics;
using Grpc.Core;

namespace MetricsServer.Services;

public class MetricsService : MetricsStreamer.MetricsStreamerBase
{
    public override async Task StreamMetrics(
        EmptyRequest request,
        IServerStreamWriter<MetricResponse> responseStream,
        ServerCallContext context)
    {
        // 1. Tüm sistemin CPU kullanımını okuyan sayaç
        using var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");

        // 2. Sistemde kalan boş RAM'i (MB cinsinden) okuyan sayaç
        using var ramCounter = new PerformanceCounter("Memory", "Available MBytes");

        // Bilgisayarınızın toplam fiziksel RAM kapasitesi (MB)
        double totalMemoryInMB = GetTotalPhysicalMemoryInMB();

        // PerformanceCounter ilk çağrıda '0' döndürür, sayacı ilk okumayla ısıtıyoruz
        cpuCounter.NextValue();
        ramCounter.NextValue();

        while (!context.CancellationToken.IsCancellationRequested)
        {
            // PerformanceCounter'ın doğru yüzdesel farkı hesaplayabilmesi için 1 sn bekleme
            await Task.Delay(1000);

            // --- Anlık Sistem CPU (% Usage) ---
            int totalCpuUsage = (int)Math.Round(cpuCounter.NextValue());

            // --- Anlık Sistem RAM (Kullanılan MB) ---
            float availableRamMB = ramCounter.NextValue();
            int usedRamMB = (int)(totalMemoryInMB - availableRamMB);

            // gRPC Yanıtı Oluşturma
            var metric = new MetricResponse
            {
                CpuUsage = Math.Clamp(totalCpuUsage, 0, 100),
                MemoryUsage = usedRamMB, // Task Manager'daki kullanılan RAM
                Timestamp = DateTime.Now.ToString("HH:mm:ss")
            };

            // Akışa yeni veriyi yaz
            await responseStream.WriteAsync(metric);
        }
    }

    private static double GetTotalPhysicalMemoryInMB()
    {
        var gcInfo = GC.GetGCMemoryInfo();
        double totalBytes = gcInfo.TotalAvailableMemoryBytes;
        return totalBytes / (1024 * 1024);
    }
}