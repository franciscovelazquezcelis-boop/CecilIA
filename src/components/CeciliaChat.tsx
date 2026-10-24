import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  PlusCircle, 
  Sparkles, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Microscope, 
  RotateCcw, 
  Clock, 
  ArrowRight,
  Search, 
  ExternalLink, 
  X, 
  History, 
  Droplet, 
  TestTube,
  ShieldCheck,
  Zap,
  Bandage,
  CornerDownLeft
} from 'lucide-react';
import { ChatMessage, ChatSession } from '../types';
import { recordChatQuestion } from '../utils/gamification';

interface CeciliaChatProps {
  initialPrompt?: string | null;
  donorContextSummary?: string | null;
  onClearInitialPrompt?: () => void;
}

const STORAGE_KEY = 'cecilia_chat_sessions_v3';
const ACTIVE_SESSION_KEY = 'cecilia_active_session_id_v3';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'model',
  content: `¡Hola! Soy **CecilIA**.

Puedes platicar conmigo con total libertad sobre cualquier tema: resolver dudas de ciencia, programación, matemáticas, filosofía, redacción o conversar de forma casual. 

Además, cuento con una especialización científica y médica de élite en **hematología, medicina transfusional, inmunohematología (ABO/Rh), marco regulatorio NOM-253-SSA1-2012 y ciencias de laboratorio clínico**. Cuando me preguntes sobre estos temas o técnicas analíticas (como González de Buitrago o Paul de Kruif), te brindaré explicaciones sumamente completas, rigurosas y detalladas.

¿Qué te gustaría explorar hoy?`,
  timestamp: new Date().toISOString()
};

export const CeciliaChat: React.FC<CeciliaChatProps> = ({ 
  initialPrompt, 
  donorContextSummary, 
  onClearInitialPrompt 
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    const defaultSession: ChatSession = {
      id: 'session-default',
      title: 'Conversación con CecilIA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [INITIAL_WELCOME_MESSAGE],
      technicalLevel: 'general'
    };
    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const active = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (active) return active;
    } catch {
      // ignore
    }
    return 'session-default';
  });

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [technicalLevel, setTechnicalLevel] = useState<'general' | 'laboratory'>('general');
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active session helper
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } catch (e) {
      console.error('Error saving chat sessions to localStorage', e);
    }
  }, [sessions, activeSessionId]);

  // Handle incoming initial prompt from Triage Simulator or NOM
  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt, donorContextSummary || undefined);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `Consulta ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [INITIAL_WELCOME_MESSAGE],
      technicalLevel: technicalLevel
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setIsHistoryDrawerOpen(false);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      const resetSession: ChatSession = {
        ...sessions[0],
        title: 'Nueva Consulta',
        messages: [INITIAL_WELCOME_MESSAGE],
        updatedAt: new Date().toISOString()
      };
      setSessions([resetSession]);
      return;
    }

    const filtered = sessions.filter((s) => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const sendMessage = async (text: string, context?: string) => {
    if (!text.trim() || isLoading) return;

    recordChatQuestion();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      donorContextSummary: context
    };

    const updatedMessages = [...currentSession.messages, userMsg];

    let newTitle = currentSession.title;
    if (currentSession.messages.length <= 1) {
      newTitle = text.slice(0, 42) + (text.length > 42 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...currentSession,
      title: newTitle,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
    );

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content
          })),
          technicalLevel: technicalLevel,
          donorContext: context || donorContextSummary || null
        })
      });

      const data = await response.json();
      const modelReply = data.reply || 'No fue posible generar una respuesta en este momento.';
      const webSources = data.webSources || [];

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: modelReply,
        timestamp: new Date().toISOString(),
        webSources: webSources.length > 0 ? webSources : undefined
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? { ...s, messages: [...updatedMessages, modelMsg], updatedAt: new Date().toISOString() }
            : s
        )
      );
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: 'Ocurrió un error momentáneo en la conexión, pero recuerda que toda la información de la NOM-253 y los fundamentos de laboratorio están disponibles en la plataforma.',
        timestamp: new Date().toISOString()
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? { ...s, messages: [...updatedMessages, errorMsg] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    // Auto-adjust height up to max 160px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const quickPrompts = [
    {
      label: '🩸 Compatibilidad ABO y Rh',
      query: 'Explícame detalladamente la compatibilidad de grupos sanguíneos ABO y Rh: ¿quién es el donante y receptor universal de glóbulos rojos vs plasma?'
    },
    {
      label: '💻 Arquitectura de Software & Algoritmos',
      query: '¿Cuáles son las mejores prácticas para estructurar un proyecto de software moderno y optimizar algoritmos?'
    },
    {
      label: '⚡ Aféresis: Plaquetas y Plasma',
      query: '¿Por qué es tan importante donar plaquetas y plasma por aféresis? ¿A qué pacientes beneficia y qué ventaja tiene para el donante?'
    },
    {
      label: '🧪 Tubos de Muestra y Anticoagulantes',
      query: 'Explícame el orden de extracción de tubos de muestra y para qué sirve cada anticoagulante (EDTA, Citrato de sodio, Heparina, Fluoruro).'
    },
    {
      label: '🌿 Fotosíntesis & Fisiología Celular',
      query: 'Explícame cómo funciona la fotosíntesis a nivel molecular: la fase luminosa en los tilacoides y el ciclo de Calvin.'
    },
    {
      label: '🩹 Cuidados Post-Donación y Reacciones',
      query: '¿Cuáles son los consejos prácticos para las primeras 24 horas después de donar sangre y qué hacer en caso de mareo o hematoma leve?'
    }
  ];

  const messageTextClass = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-relaxed'
  }[fontSize];

  return (
    <div className="relative w-full h-[calc(100vh-125px)] min-h-[760px] flex flex-col rounded-3xl border border-slate-800 bg-slate-950/95 overflow-hidden shadow-2xl">
      
      {/* Slide-over Drawer for History */}
      {isHistoryDrawerOpen && (
        <div className="absolute inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsHistoryDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-slate-900 border-r border-slate-800 p-5 flex flex-col space-y-4 shadow-2xl z-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white">
                <Clock className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Historial de Conversaciones</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleCreateNewSession}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Consulta</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => {
                      setActiveSessionId(sess.id);
                      setIsHistoryDrawerOpen(false);
                    }}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-all ${
                      isActive
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-700/70 font-medium shadow-md'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate font-semibold text-slate-200">{sess.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(sess.updatedAt).toLocaleDateString('es-MX', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-opacity"
                      title="Eliminar sesión"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-rose-400 block">Pilares de Conocimiento:</span>
              <p className="text-[10px] text-slate-400 leading-tight">
                NOM-253-SSA1-2012 • J.M. González de Buitrago • Paul de Kruif • Google Search Grounding
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Header: Full Width Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md">
        
        {/* Left: Persona Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/60 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">CecilIA</h2>
              <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>En Línea &amp; Búsqueda Web</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Especialista Médica en Hematología, Medicina Transfusional &amp; Laboratorio Clínico
            </p>
          </div>
        </div>

        {/* Right Controls: History Drawer Button, Font Size, Mode */}
        <div className="flex items-center space-x-2">
          
          {/* History Button */}
          <button
            type="button"
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors shadow-sm"
            title="Abrir historial de conversaciones"
          >
            <History className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Historial</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400">
              {sessions.length}
            </span>
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleCreateNewSession}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-medium transition-colors flex items-center space-x-1"
            title="Iniciar nueva conversación"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Consulta</span>
          </button>

          {/* Font Size Selector */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-1 font-mono text-[11px]">Letra:</span>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'normal' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Tamaño normal"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'large' ? 'bg-rose-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Tamaño grande (recomendado)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded-lg ${fontSize === 'xlarge' ? 'bg-rose-700 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Tamaño muy grande"
            >
              A++
            </button>
          </div>

        </div>
      </div>

      {/* Main Messages Stream: 100% Full Width Space */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {currentSession.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md ${
                    isUser
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-gradient-to-br from-rose-700 via-rose-600 to-red-600 border border-rose-500/50'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5 text-slate-200" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Message Content Container */}
                <div className={`space-y-1.5 max-w-[92%] sm:max-w-[85%] lg:max-w-[80%]`}>
                  {msg.donorContextSummary && (
                    <div className="text-xs font-mono bg-rose-950/70 text-rose-300 border border-rose-800/40 px-3 py-1 rounded-lg mb-1 inline-block">
                      📋 Contexto de Triaje Integrado
                    </div>
                  )}

                  <div
                    className={`rounded-3xl px-6 py-4.5 shadow-lg ${messageTextClass} ${
                      isUser
                        ? 'bg-rose-700 text-white rounded-tr-none'
                        : 'bg-slate-900/95 text-slate-100 border border-slate-800/80 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}

                    {/* Grounded Web Sources if used */}
                    {msg.webSources && msg.webSources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-rose-400 font-semibold">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Fuentes Verificadas en la Web:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.webSources.map((source, sIdx) => (
                            <a
                              key={sIdx}
                              href={source.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-rose-600 text-[11px] transition-colors"
                            >
                              <span className="truncate max-w-[240px]">{source.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`text-[11px] text-slate-400 px-2 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-red-600 flex items-center justify-center shrink-0 text-white animate-pulse shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div className="rounded-3xl rounded-tl-none px-6 py-4 bg-slate-900 border border-slate-800 text-slate-300 text-sm flex items-center space-x-3 shadow-lg">
                <span className="flex space-x-1.5">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></span>
                </span>
                <span>CecilIA está estructurando una respuesta clínica detallada...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 sm:px-6 py-2.5 border-t border-slate-900 bg-slate-950/90 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-mono text-slate-400 whitespace-nowrap flex items-center space-x-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Preguntas Sugeridas:</span>
        </span>
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(chip.query)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-700 text-slate-300 hover:text-rose-200 transition-colors shrink-0"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Bottom Input Area: Large, Generous & Multi-line Capable */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="relative flex items-end bg-slate-950 border border-slate-700/80 rounded-2xl p-2 shadow-inner focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Haz cualquier pregunta (conocimiento general, programación, ciencia, o laboratorio clínico y donación)..."
              className="w-full bg-transparent border-0 resize-none px-3 py-2 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none max-h-36 overflow-y-auto"
            />
            <button
              type="button"
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-tr from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 disabled:opacity-40 disabled:hover:from-rose-700 text-white transition-all cursor-pointer shadow-md shrink-0 ml-2"
              title="Enviar consulta (Enter)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 px-2 text-[11px] text-slate-400 gap-1">
            <span className="flex items-center space-x-1">
              <CornerDownLeft className="w-3 h-3 text-slate-500 inline" />
              <span>Presiona <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para salto de línea.</span>
            </span>
            <span className="font-mono text-rose-400 font-semibold shrink-0">
              NOM-253 • Buitrago • De Kruif • Búsqueda Web Activa
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
