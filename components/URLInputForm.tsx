import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { VoiceModeSelector } from './VoiceModeSelector';
import { ExplanationStyleSelector } from './ExplanationStyleSelector';
import { VoiceMode, ExplanationStyle } from '../types';

interface ContentInputFormProps {
  content: string;
  setContent: (content: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  voiceMode: VoiceMode;
  setVoiceMode: (mode: VoiceMode) => void;
  explanationStyle: ExplanationStyle;
  setExplanationStyle: (style: ExplanationStyle) => void;
}

export const ContentInputForm: React.FC<ContentInputFormProps> = ({ 
    content, setContent, onSubmit, isLoading, voiceMode, setVoiceMode, explanationStyle, setExplanationStyle 
}) => {
  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Pega aquí el contenido para tu lección mágica..."
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 min-h-[150px] resize-y"
          required
          disabled={isLoading}
        />
        
        <ExplanationStyleSelector 
            selectedStyle={explanationStyle} 
            setStyle={setExplanationStyle} 
            isLoading={isLoading} 
        />
       
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <div className="w-full sm:w-auto sm:flex-grow">
                 <VoiceModeSelector voiceMode={voiceMode} setVoiceMode={setVoiceMode} isLoading={isLoading} />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex-shrink-0"
            >
              <MagicWandIcon />
              <span>{isLoading ? 'Creando Magia...' : '¡Hazlo Mágico!'}</span>
            </button>
        </div>
      </form>
    </div>
  );
};