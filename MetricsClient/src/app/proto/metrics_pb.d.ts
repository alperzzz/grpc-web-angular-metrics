import * as jspb from 'google-protobuf'



export class EmptyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
  static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyRequest;
  static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
  export type AsObject = {
  };
}

export class MetricResponse extends jspb.Message {
  getCpuUsage(): number;
  setCpuUsage(value: number): MetricResponse;

  getMemoryUsage(): number;
  setMemoryUsage(value: number): MetricResponse;

  getTimestamp(): string;
  setTimestamp(value: string): MetricResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MetricResponse): MetricResponse.AsObject;
  static serializeBinaryToWriter(message: MetricResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricResponse;
  static deserializeBinaryFromReader(message: MetricResponse, reader: jspb.BinaryReader): MetricResponse;
}

export namespace MetricResponse {
  export type AsObject = {
    cpuUsage: number;
    memoryUsage: number;
    timestamp: string;
  };
}

