import React from 'react';
import { SavedAudio } from '../types';
import { WelcomeDisplay } from './WelcomeDisplay';
import { PlayIcon } from './icons/PlayIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface AudioManagerProps {
    audios: SavedAudio[];
    onPlay: (audio: SavedAudio) => void;
    onDelete: (id: string) => void;
    onGoToMain: () => void;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ audios, onPlay, onDelete, onGoToMain }) => {
    if (audios.length === 0) {
        return <WelcomeDisplay onAction={onGoToMain} isListEmpty={true} />;
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-300">Mis Lecciones</h2>
                <button
                    onClick={onGoToMain}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
                    aria-label="Crear nueva lección"
                >
                    <PlusIcon />
                    <span>Crear Nueva</span>
                </button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {audios.map((audio, index) => (
                    <div 
                        key={audio.id} 
                        className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors duration-200"
                    >
                        <div className="flex items-center flex-grow min-w-0">
                            <p className="text-slate-200 font-medium truncate" title={audio.title}>
                                {audio.title}
                            </p>
                            {index === 0 && (
                                <span className="ml-2 flex-shrink-0 px-2 py-0.5 text-xs font-bold text-cyan-400 bg-cyan-500/20 rounded-full">
                                    NUEVO
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => onPlay(audio)}
                                className="p-2 rounded-full bg-slate-700 text-cyan-400 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                                aria-label={`Reproducir ${audio.title}`}
                            >
                                <PlayIcon className="h-5 w-5" />
                            </button>
                             <button
                                onClick={() => onDelete(audio.id)}
                                className="p-2 rounded-full bg-slate-700 text-red-400 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all"
                                aria-label={`Eliminar ${audio.title}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};