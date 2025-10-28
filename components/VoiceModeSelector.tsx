import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { UsersIcon } from './icons/UsersIcon';

interface VoiceModeSelectorProps {
  voiceMode: 'single' | 'dual';
  setVoiceMode: (mode: 'single' | 'dual') => void;
  isLoading: boolean;
}

export const VoiceModeSelector: React.FC<VoiceModeSelectorProps> = ({ voiceMode, setVoiceMode, isLoading }) => {
  const baseButtonClasses = "w-1/2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200";
  const activeClasses = "bg-slate-600 text-cyan-300 shadow-inner";
  const inactiveClasses = "bg-slate-700/50 text-slate-400 hover:bg-slate-700";

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-slate-400 whitespace-nowrap">Estilo de Voz:</label>
      <div className="w-full flex p-1 gap-1 bg-slate-800 border border-slate-700 rounded-lg">
        <button
          type="button"
          onClick={() => setVoiceMode('single')}
          disabled={isLoading}
          className={`${baseButtonClasses} ${voiceMode === 'single' ? activeClasses : inactiveClasses}`}
          aria-pressed={voiceMode === 'single'}
        >
          <UserIcon />
          <span>Una Voz</span>
        </button>
        <button
          type="button"
          onClick={() => setVoiceMode('dual')}
          disabled={isLoading}
          className={`${baseButtonClasses} ${voiceMode === 'dual' ? activeClasses : inactiveClasses}`}
          aria-pressed={voiceMode === 'dual'}
        >
          <UsersIcon />
          <span>Dos Voces</span>
        </button>
      </div>
    </div>
  );
};