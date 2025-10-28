import React, { useState, useEffect } from 'react';

const audioMessages = [
    "Consultando al maestro...",
    "Preparando la lección...",
    "Afinando la voz para ti...",
    "Grabando tu explicación personalizada...",
    "¡La clase está a punto de empezar!",
];

export const LoadingDisplay: React.FC = () => {
    const [message, setMessage] = useState(audioMessages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = audioMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % audioMessages.length;
                return audioMessages[nextIndex];
            });
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
             <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-lg text-slate-400 animate-pulse">{message}</p>
        </div>
    );
};