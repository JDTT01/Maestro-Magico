import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-5 rounded-lg relative text-center" role="alert">
      <strong className="font-bold block text-lg">¡Error!</strong>
      <span className="block mt-1">{message}</span>
       <button
        onClick={onReset}
        className="mt-4 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-red-900/50 transition-colors duration-200"
      >
        Intentar de nuevo
      </button>
    </div>
  );
};