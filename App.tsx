import React, { useState, useCallback } from 'react';
import { ContentInputForm } from './components/URLInputForm';
import { LoadingDisplay } from './components/LoadingDisplay';
import { AudioPlayer } from './components/AudioPlayer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { AudioManager } from './components/AudioManager';
import { WelcomeDisplay } from './components/WelcomeDisplay';
import { explainContentWithVoice, generateTitleForContent, askQuestionAboutContent } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';
import { AppState, VoiceMode, SavedAudio, ExplanationStyle, ChatMessage } from './types';
import { ListIcon } from './components/icons/ListIcon';

type AppView = 'main' | 'list';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('single');
  const [explanationStyle, setExplanationStyle] = useState<ExplanationStyle>('friendly');
  const [savedAudios, setSavedAudios] = useState<SavedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<SavedAudio | null>(null);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('Por favor, pega algo de contenido para que el maestro pueda empezar.');
      setAppState('error');
      return;
    }

    setAppState('loading');
    setError(null);
    setCurrentAudio(null);

    try {
      const [base64Audio, title] = await Promise.all([
        explainContentWithVoice(content, voiceMode, explanationStyle),
        generateTitleForContent(content)
      ]);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decode(base64Audio);
      const buffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
      
      const newAudio: SavedAudio = {
        id: Date.now().toString(),
        title: title,
        audioBuffer: buffer,
        content: content,
        chatHistory: [],
      };

      setSavedAudios(prev => [newAudio, ...prev]);
      setContent('');
      setAppState('welcome');
      setCurrentView('list');

    } catch (err) {
      if (err instanceof Error) {
        setError(`¡Ups! Hubo un problema con la lección. ${err.message}`);
      } else {
        setError('Ocurrió un error desconocido. Inténtalo de nuevo.');
      }
      setAppState('error');
    }
  }, [content, voiceMode, explanationStyle]);

  const handleErrorReset = useCallback(() => {
    setAppState('welcome');
    setError(null);
  }, []);

  const handlePlay = useCallback((audio: SavedAudio) => {
    setCurrentAudio(audio);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setSavedAudios(prev => prev.filter(audio => audio.id !== id));
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentAudio(null);
    setCurrentView('list');
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!currentAudio) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    
    // Optimistically update UI with user's message
    const updatedHistory = [...currentAudio.chatHistory, userMessage];
    setCurrentAudio({ ...currentAudio, chatHistory: updatedHistory });
    setSavedAudios(prev => prev.map(audio => audio.id === currentAudio.id ? { ...audio, chatHistory: updatedHistory } : audio));

    setIsChatLoading(true);

    try {
      const modelResponseText = await askQuestionAboutContent(message, currentAudio.content, currentAudio.chatHistory);
      const modelMessage: ChatMessage = { role: 'model', text: modelResponseText };

      setCurrentAudio(prev => prev ? { ...prev, chatHistory: [...prev.chatHistory, modelMessage] } : null);
      setSavedAudios(prev => prev.map(audio => audio.id === currentAudio.id ? { ...audio, chatHistory: [...audio.chatHistory, modelMessage] } : audio));

    } catch (err) {
      const errorMessage: ChatMessage = { role: 'model', text: "Lo siento, tuve un problema al procesar tu pregunta. Inténtalo de nuevo." };
      setCurrentAudio(prev => prev ? { ...prev, chatHistory: [...prev.chatHistory, errorMessage] } : null);
      setSavedAudios(prev => prev.map(audio => audio.id === currentAudio.id ? { ...audio, chatHistory: [...audio.chatHistory, errorMessage] } : audio));
    } finally {
      setIsChatLoading(false);
    }
  }, [currentAudio]);
  
  const isLoading = appState === 'loading';

  const renderContent = () => {
    if (currentAudio) {
      return (
        <AudioPlayer 
          audioBuffer={currentAudio.audioBuffer}
          title={currentAudio.title}
          onBack={handleBackToList}
          chatHistory={currentAudio.chatHistory}
          onSendMessage={handleSendMessage}
          isChatLoading={isChatLoading}
        />
      );
    }

    if (currentView === 'list') {
      return (
        <AudioManager 
          audios={savedAudios}
          onPlay={handlePlay}
          onDelete={handleDelete}
          onGoToMain={() => setCurrentView('main')}
        />
      );
    }
    
    return (
       <>
        <ContentInputForm 
            content={content} 
            setContent={setContent} 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            voiceMode={voiceMode}
            setVoiceMode={setVoiceMode}
            explanationStyle={explanationStyle}
            setExplanationStyle={setExplanationStyle}
        />
        <div className="mt-8 min-h-[300px] flex items-center justify-center">
            {isLoading && <LoadingDisplay />}
            {appState === 'error' && error && <ErrorDisplay message={error} onReset={handleErrorReset} />}
            {appState === 'welcome' && !isLoading && !error && <WelcomeDisplay />}
        </div>
       </>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 p-6 sm:p-8">
          <header className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-100">
              Maestro Mágico
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Pega un texto y te lo explicaré con voz, como si fuéramos amigos.
            </p>
          </header>

          {currentView === 'main' && (
             <div className="w-full flex justify-end mb-4">
                <button 
                  onClick={() => setCurrentView('list')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
                  aria-label="Ver mis lecciones"
                >
                  <ListIcon />
                  <span>Mis Lecciones</span>
                  {savedAudios.length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-cyan-200 bg-cyan-600 rounded-full">{savedAudios.length}</span>
                  )}
                </button>
             </div>
          )}

          <main>
            {renderContent()}
          </main>
        </div>
        <footer className="text-center mt-8 text-slate-500 text-sm">
              <p>Creado con React, Tailwind CSS y la magia de Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;