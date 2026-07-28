import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetricsStreamerClient } from './proto/MetricsServiceClientPb';
import metrics_pb from './proto/metrics_pb';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private client: MetricsStreamerClient;

  constructor() {
    this.client = new MetricsStreamerClient('http://localhost:5270');
  }

  getMetricsStream(): Observable<any> {
    return new Observable((observer) => {
      const pb: any = (metrics_pb as any).default || metrics_pb;
      const request = new pb.EmptyRequest();

      const stream = this.client.streamMetrics(request, {});

      stream.on('data', (response: any) => {
        observer.next(response);
      });

      stream.on('error', (err: any) => {
        observer.error(err);
      });

      stream.on('end', () => {
        observer.complete();
      });

      return () => {
        stream.cancel();
      };
    });
  }
}