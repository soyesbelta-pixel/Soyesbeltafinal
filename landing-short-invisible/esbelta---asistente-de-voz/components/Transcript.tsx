
import React from 'react';
import { TranscriptEntry } from '../types';

interface TranscriptProps {
  transcript: TranscriptEntry[];
  currentInput: string;
  currentOutput: string;
}

const TranscriptBubble: React.FC<{ entry: TranscriptEntry }> = ({ entry }) => {
  const isModel = entry.speaker === 'model';
  return (
    <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-2xl shadow-md ${
          isModel
            ? 'bg-white text-gray-800 rounded-bl-none'
            : 'bg-rose-500 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm">{entry.text}</p>
      </div>
    </div>
  );
};

const LiveTranscriptBubble: React.FC<{ text: string, speaker: 'user' | 'model' }> = ({ text, speaker }) => {
    if (!text) return null;
    const isModel = speaker === 'model';
    return (
        <div className={`flex ${isModel ? 'justify-start' : 'justify-end'} mb-4`}>
          <div
            className={`max-w-xl px-4 py-3 rounded-2xl shadow-md opacity-70 ${
              isModel
                ? 'bg-white text-gray-800 rounded-bl-none'
                : 'bg-rose-500 text-white rounded-br-none'
            }`}
          >
            <p className="text-sm italic">{text}</p>
          </div>
        </div>
      );
}

export const Transcript: React.FC<TranscriptProps> = ({ transcript, currentInput, currentOutput }) => {
  const transcriptEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentInput, currentOutput]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-pink-100/50 rounded-lg">
      {transcript.map((entry, index) => (
        <TranscriptBubble key={index} entry={entry} />
      ))}
      <LiveTranscriptBubble text={currentInput} speaker="user" />
      <LiveTranscriptBubble text={currentOutput} speaker="model" />
      <div ref={transcriptEndRef} />
    </div>
  );
};
