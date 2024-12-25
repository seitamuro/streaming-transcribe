import { AWSCredentials } from '@aws-amplify/core/internals/utils';
import { TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';

export interface Transcript {
  channel: string;
  partial?: boolean;
  text?: string;
}

export interface LiveTranscriptionProps {
  currentCredentials: AWSCredentials;
  mediaRecorder: AudioWorkletNode | undefined;
  setMediaRecorder: (m: AudioWorkletNode) => void;
  setTranscriptionClient: (a: TranscribeStreamingClient) => void;
  transcriptionClient: TranscribeStreamingClient | null;
  transcribeStatus: boolean;
  setTranscript: (t: Transcript) => void;
}

export type RecordingProperties = {
  numberOfChannels: number;
  sampleRate: number;
  maxFrameCount: number;
};

export type MessageDataType = {
  message: string;
  buffer: Array<Float32Array>;
  recordingLength: number;
};
