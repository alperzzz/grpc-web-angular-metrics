\# 🚀 Live System Metrics Dashboard (gRPC-Web \& Angular 19)



Real-time system monitoring dashboard built with \*\*Angular 19\*\*, \*\*.NET 9\*\*, and \*\*gRPC-Web\*\*. Demonstrates high-performance \*\*Server Streaming RPC\*\* for streaming live server telemetry (CPU/RAM usage) directly to a modern web application without WebSocket overhead.



\---



\## 🏗️ Architecture Overview



┌─────────────────────────┐               ┌─────────────────────────┐

│   Angular Frontend      │  HTTP/2 POST  │    .NET 9 Backend       │

│                         │──────────────►│                         │

│   (MetricsService)      │  gRPC-Web     │   (MetricsService.cs)   │

│                         │◄──────────────│                         │

│                         │ Server-Stream │                         │

└─────────────────────────┘  (Protobuf)   └─────────────────────────┘



\- \*\*Protocol Buffers (Protobuf):\*\* Strongly-typed contract definition for `EmptyRequest` and `MetricResponse`.

\- \*\*gRPC-Web Transpilation:\*\* Generated client artifacts (`\*\_pb.js` \& `\*ServiceClientPb.ts`) bridging browser limitations for native gRPC streaming.

\- \*\*Vite \& esbuild Compatibility:\*\* ESM module resolution and runtime shim configuration for Proto classes in Angular 19.

\- \*\*CORS \& Preflight Handling:\*\* Configured `WithExposedHeaders` for gRPC status headers (`Grpc-Status`, `Grpc-Message`, `X-Grpc-Web`).



\---



\## ✨ Features



\- ⚡ \*\*Real-Time Data Streaming:\*\* Low-latency continuous binary stream via gRPC Server Streaming.

\- 🎨 \*\*Reactive Dashboard UI:\*\* Live visual indicators and progress bars for CPU and RAM consumption.

\- 🔄 \*\*Automatic Change Detection:\*\* Instant UI updates powered by Angular RxJS pipelines and `ChangeDetectorRef`.

\- 🔐 \*\*Cross-Origin Streaming:\*\* Full CORS preflight middleware setup for smooth browser-to-server communication.



\---



\## 🛠️ Tech Stack



\- \*\*Frontend:\*\* Angular 19, TypeScript, RxJS, `grpc-web`, `google-protobuf`

\- \*\*Backend:\*\* .NET 9 Web API, `Grpc.AspNetCore`, `Grpc.AspNetCore.Web`

\- \*\*Protocol:\*\* gRPC-Web (Server Streaming), Protocol Buffers v3



\---



\## 🚀 Getting Started



\### Prerequisites



\- \[Node.js](https://nodejs.org/) (v18 or higher)

\- \[.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

\- Angular CLI (`npm i -g @angular/cli`)



\---



\### 1. Backend Setup (.NET 9)



```bash

\# Navigate to the server folder

cd MetricsServer



\# Restore dependencies

dotnet restore



\# Run the gRPC server

dotnet run

```

The gRPC-Web server will start listening on http://localhost:5270.



2\. Frontend Setup (Angular)



\# Navigate to the client folder
```bash
cd MetricsClient
npm install
ng serve
```



Open your browser and navigate to http://localhost:4200.



📄 Protocol Buffer Contract (metrics.proto)
```
syntax = "proto3";

package metrics;

service MetricsStreamer {
  rpc StreamMetrics (EmptyRequest) returns (stream MetricResponse);
}

message EmptyRequest {}

message MetricResponse {
  int32 cpu_usage = 1;
  int32 memory_usage = 2;
  string timestamp = 3;
}
```


📝 Key Takeaways \& Fixes Implemented

Resolved ES Module bundling issues (import \* as jspb vs CommonJS require).



Patched gRPC-Web preflight OPTIONS CORS handshakes in ASP.NET Core middleware.



Implemented toObject() fallback for safe Protobuf DTO deserialization in Angular.



