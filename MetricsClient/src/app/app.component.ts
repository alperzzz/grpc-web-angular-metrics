import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 650px; margin: auto;">
      <h2 style="text-align: center; color: #333;">🚀 Canlı Sistem Metrikleri Dashboard</h2>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">gRPC-Web & .NET 9 Server Streaming</p>
      
      <!-- Hata Mesajı -->
      <div *ngIf="errorMessage" style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        {{ errorMessage }}
      </div>

      <!-- Veri Geldiğinde Görünecek Kart -->
      <div *ngIf="lastMetric" style="border: 1px solid #e0e0e0; padding: 25px; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span style="font-weight: bold; color: #555;">Son Güncelleme:</span>
          <span style="background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 20px; font-weight: 600;">{{ lastMetric.getTimestamp() }}</span>
        </div>
        
        <!-- CPU Progress Bar -->
        <div style="margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #333;">CPU Kullanımı (Tüm Sistem)</span>
            <span style="font-weight: bold; color: #ef4444;">%{{ lastMetric.getCpuUsage() }}</span>
          </div>
          <div style="background: #f3f4f6; height: 16px; border-radius: 8px; overflow: hidden;">
            <div [style.width.%]="lastMetric.getCpuUsage()" style="background: #ef4444; height: 100%; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- RAM Progress Bar -->
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #333;">RAM Kullanımı (Kullanılan)</span>
            <span style="font-weight: bold; color: #10b981;">{{ lastMetric.getMemoryUsage() }} MB</span>
          </div>
          <div style="background: #f3f4f6; height: 16px; border-radius: 8px; overflow: hidden;">
            <!-- 32GB RAM oranlaması -->
            <div [style.width.%]="(lastMetric.getMemoryUsage() / 32768) * 100" style="background: #10b981; height: 100%; transition: width 0.3s ease;"></div>
          </div>
        </div>
      </div>

      <!-- Yükleniyor / Veri Bekleniyor -->
      <div *ngIf="!lastMetric && !errorMessage" style="text-align: center; padding: 40px; color: #888;">
        <p>gRPC sunucusundan canlı veri akışı bekleniyor...</p>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  public lastMetric: any = null;
  public errorMessage: string = '';
  private sub!: Subscription;

  constructor(private metricsService: MetricsService) {}

  ngOnInit() {
    console.log('gRPC Akışı başlatılıyor...');
    
    this.sub = this.metricsService.getMetricsStream().subscribe({
      next: (data) => {
        console.log('Yeni Metrik Geldi:', data.getCpuUsage(), data.getMemoryUsage());
        this.lastMetric = data;
      },
      error: (err) => {
        console.error('gRPC Bağlantı Hatası:', err);
        this.errorMessage = 'Sunucuya bağlanılamadı. .NET sunucusunun (localhost:5270) çalıştığından emin olun.';
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}