# Live System Metrics Dashboard

Real-time system monitoring dashboard built with **Angular 22**, **.NET 9**, and **gRPC-Web**. It streams CPU and RAM telemetry from the server to the browser using server-streaming RPC.

## Architecture

```text
Angular frontend (MetricsService)  -- gRPC-Web -->  .NET 9 backend (MetricsService)
                                  <-- server stream --
```

- **Protocol Buffers:** Strongly typed `EmptyRequest` and `MetricResponse` contract.
- **gRPC-Web:** Generated browser client artifacts bridge browser and gRPC transport requirements.
- **CORS:** The backend exposes the gRPC response headers required by the browser client.

## Features

- Live CPU and RAM updates every second.
- Reactive Angular dashboard with CPU and RAM progress bars.
- gRPC server-streaming transport over gRPC-Web.

## Technology stack

- **Frontend:** Angular 22, TypeScript, RxJS, `grpc-web`, `google-protobuf`
- **Backend:** .NET 9, `Grpc.AspNetCore`, `Grpc.AspNetCore.Web`
- **Protocol:** Protocol Buffers v3 and gRPC-Web server streaming

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)

## Run the application

### 1. Start the backend

```bash
cd MetricsServer
dotnet restore
dotnet run
```

The gRPC-Web server listens on `http://localhost:5270`.

### 2. Start the frontend

```bash
cd MetricsClient
npm install
npm start
```

Open `http://localhost:4200` in a browser.

## Protocol Buffer contract

```proto
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
