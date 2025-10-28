import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { ChatMessage } from '../types';

interface AudioPlayerProps {
  audioBuffer: AudioBuffer;
  title: string;
  onBack: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isChatLoading: boolean;
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
    audioBuffer, title, onBack, chatHistory, onSendMessage, isChatLoading 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = audioBuffer.duration;

  const [userMessage, setUserMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      sourceNodeRef.current?.stop();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isChatLoading]);

  const animateProgress = useCallback(() => {
    if (!audioContextRef.current) return;
    const newCurrentTime = audioContextRef.current.currentTime - startTimeRef.current;
    if (newCurrentTime < duration) {
        setCurrentTime(newCurrentTime);
        animationFrameRef.current = requestAnimationFrame(animateProgress);
    } else {
        setCurrentTime(duration);
    }
  }, [duration]);

  const play = useCallback(() => {
    if (!audioContextRef.current || !audioBuffer || isPlaying) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
        if (sourceNodeRef.current === source) {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            setIsPlaying(false);
            setCurrentTime(duration);
            pauseTimeRef.current = duration; 
            sourceNodeRef.current = null;
        }
    };
    source.start(0, pauseTimeRef.current);
    startTimeRef.current = audioContextRef.current.currentTime - pauseTimeRef.current;
    sourceNodeRef.current = source;
    setIsPlaying(true);
    animationFrameRef.current = requestAnimationFrame(animateProgress);
  }, [audioBuffer, isPlaying, animateProgress, duration]);

  const pause = useCallback(() => {
    if (!isPlaying || !sourceNodeRef.current || !audioContextRef.current) return;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
    sourceNodeRef.current.onended = null;
    sourceNodeRef.current.stop();
    sourceNodeRef.current = null;
    setIsPlaying(false);
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null;
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    pauseTimeRef.current = 0;
  }, []);
  
  const handleBackClick = () => {
    stop();
    onBack();
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (isPlaying) pause();
    setCurrentTime(newTime);
    pauseTimeRef.current = newTime;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTime >= duration) {
           pauseTimeRef.current = 0;
           setCurrentTime(0);
      }
      play();
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userMessage.trim() && !isChatLoading) {
        onSendMessage(userMessage.trim());
        setUserMessage('');
    }
  };

  const progressBarStyle = {
    background: `linear-gradient(to right, #06b6d4 ${ (currentTime / duration) * 100 }%, #334155 ${ (currentTime / duration) * 100 }%)`
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-0 sm:p-2 space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-100 truncate max-w-full" title={title}>{title}</h2>
        
        <div className="w-full max-w-sm bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlayPause}
                    className="w-14 h-14 rounded-full bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="w-full flex flex-col">
                    <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={currentTime}
                        onChange={handleSeek}
                        style={progressBarStyle}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 px-0.5">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="w-full max-w-sm">
            <h3 className="text-lg font-bold text-slate-300 mb-2 text-left">¿Tienes dudas?</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex flex-col h-64">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-4 mb-2">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="text-sm" style={{ wordWrap: 'break-word' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg">
                                <p className="text-sm animate-pulse">Escribiendo...</p>
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleChatSubmit} className="mt-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Pregúntale al maestro..."
                        disabled={isChatLoading}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                    />
                    <button
                        type="submit"
                        disabled={isChatLoading || !userMessage.trim()}
                        className="p-2.5 rounded-full bg-cyan-600 text-white flex-shrink-0 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        aria-label="Enviar pregunta"
                    >
                        <PaperAirplaneIcon />
                    </button>
                </form>
            </div>
        </div>

        <button
            onClick={handleBackClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 mt-4"
            aria-label="Volver a la lista"
        >
            <ArrowLeftIcon />
            <span>Volver a la lista</span>
        </button>
    </div>
  );
};