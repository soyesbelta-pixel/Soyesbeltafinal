
export interface TranscriptEntry {
  speaker: 'user' | 'model';
  text: string;
}

export enum SessionState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
}
