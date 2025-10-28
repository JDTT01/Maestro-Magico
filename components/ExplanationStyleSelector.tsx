import React from 'react';
import { ExplanationStyle } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { TargetIcon } from './icons/TargetIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface ExplanationStyleSelectorProps {
  selectedStyle: ExplanationStyle;
  setStyle: (style: ExplanationStyle) => void;
  isLoading: boolean;
}

const styles: { id: ExplanationStyle; label: string; icon: React.ReactNode }[] = [
  { id: 'friendly', label: 'Amigable', icon: <SparklesIcon /> },
  { id: 'concise', label: 'Conciso', icon: <TargetIcon /> },
  { id: 'detailed', label: 'Detallado', icon: <BookOpenIcon /> },
  { id: 'professional', label: 'Profesional', icon: <BriefcaseIcon /> },
];

export const ExplanationStyleSelector: React.FC<ExplanationStyleSelectorProps> = ({ selectedStyle, setStyle, isLoading }) => {
  const baseButtonClasses = "w-full flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  const activeClasses = "bg-slate-600 text-cyan-300 shadow-inner";
  const inactiveClasses = "bg-slate-700/50 text-slate-400 hover:bg-slate-700";

  return (
    <div>
      <label className="text-sm font-medium text-slate-400 mb-2 block">Estilo de Explicación:</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {styles.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setStyle(id)}
            disabled={isLoading}
            className={`${baseButtonClasses} ${selectedStyle === id ? activeClasses : inactiveClasses}`}
            aria-pressed={selectedStyle === id}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};