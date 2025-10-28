export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export type SavedAudio = {
  id: string;
  title: string;
  audioBuffer: AudioBuffer;
  content: string; // The original text content
  chatHistory: ChatMessage[];
};

export type VoiceMode = 'single' | 'dual';

export type ExplanationStyle = 'friendly' | 'concise' | 'detailed' | 'professional';

export type AppState = 'welcome' | 'loading' | 'error';