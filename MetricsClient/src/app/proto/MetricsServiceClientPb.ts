import * as grpcWeb from 'grpc-web';
import metrics_pb from './metrics_pb';

export class MetricsStreamerClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: {[key: string]: string};
  options_: {[key: string]: any};

  constructor (hostname: string,
               credentials?: {[key: string]: string},
               options?: {[key: string]: any}) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  // Modül nesnesini güvenli şekilde çözümlüyoruz:
  private pb: any = (metrics_pb as any).default || metrics_pb;

  methodDescriptorstreamMetrics = new grpcWeb.MethodDescriptor(
    '/metrics.MetricsStreamer/StreamMetrics',
    grpcWeb.MethodType.SERVER_STREAMING,
    this.pb.EmptyRequest,
    this.pb.MetricResponse,
    (request: any) => {
      return request.serializeBinary();
    },
    this.pb.MetricResponse ? this.pb.MetricResponse.deserializeBinary : (bytes: Uint8Array) => this.pb.MetricResponse.deserializeBinary(bytes)
  );

  streamMetrics(
    request: any,
    metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/metrics.MetricsStreamer/StreamMetrics',
      request,
      metadata || {},
      this.methodDescriptorstreamMetrics);
  }
}