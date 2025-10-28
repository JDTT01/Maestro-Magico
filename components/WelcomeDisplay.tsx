import React from 'react';
import { SoundWaveIcon } from './icons/SoundWaveIcon';
import { PlusIcon } from './icons/PlusIcon';

interface WelcomeDisplayProps {
    onAction?: () => void;
    isListEmpty?: boolean;
}

export const WelcomeDisplay: React.FC<WelcomeDisplayProps> = ({ onAction, isListEmpty = false }) => {
    return (
        <div className="text-center p-8 w-full">
            <div className="flex justify-center items-center mb-6">
                <SoundWaveIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
                {isListEmpty ? 'Tu lista de lecciones está vacía' : '¡Bienvenido al Maestro Mágico!'}
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
                {isListEmpty 
                    ? '¡Es hora de crear tu primera lección de audio! Vuelve y pega un texto para empezar.' 
                    : '¿Cansado de leer? Pega cualquier texto arriba y un maestro amigable te lo explicará con voz.'
                }
            </p>
            {onAction && (
                <div className="mt-8">
                    <button
                        onClick={onAction}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
                    >
                        <PlusIcon />
                        <span>Crear mi primera lección</span>
                    </button>
                </div>
            )}
        </div>
    );
}