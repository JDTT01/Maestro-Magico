import React from 'react';

interface PreviewDisplayProps {
  title: string;
  summary: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PreviewDisplay: React.FC<PreviewDisplayProps> = ({ title, summary, onConfirm, onCancel }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl animate-fade-in text-center">
      <h2 className="text-xl font-bold text-slate-300 mb-2">¿Es esta la página correcta?</h2>
      <p className="text-slate-400 mb-6">Confirma si este es el contenido que quieres que te explique.</p>
      
      <div className="text-left bg-slate-900/70 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-purple-400 truncate">{title}</h3>
        <p className="text-slate-400 mt-2 text-sm">{summary}</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onConfirm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
        >
          Sí, ¡Explícamelo!
        </button>
        <button
          onClick={onCancel}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
        >
          No, probar otra URL
        </button>
      </div>
    </div>
  );
};
