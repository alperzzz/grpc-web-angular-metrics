import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  public lastMetric: any = null;
  public errorMessage: string = '';
  public isDarkTheme = false;
  private sub!: Subscription;

  constructor(
    private metricsService: MetricsService,
    private cdr: ChangeDetectorRef // 👈 ChangeDetectorRef ekledik
  ) {}

  ngOnInit() {
    this.sub = this.metricsService.getMetricsStream().subscribe({
      next: (data) => {
        console.log('gRPC Verisi Yakalandı:', data);
        
        // Eğer data Protobuf nesnesiyse toObject() ile DTO'ya çevirebiliriz
        if (data && typeof data.toObject === 'function') {
          this.lastMetric = data.toObject();
        } else {
          this.lastMetric = data;
        }

        // Angular arayüzünü anında güncellemesi için zorluyoruz
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('gRPC Bağlantı Hatası:', err);
        this.errorMessage = 'Sunucuya bağlanılamadı.';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
