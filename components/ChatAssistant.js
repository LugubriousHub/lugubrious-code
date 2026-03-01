'use client';

import { MessageCircle, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { copy } from '../app/lib/translations';

function getRoleFromPath(pathname) {
  if (pathname.includes('/b2b')) return 'b2b';
  if (pathname.includes('/consumer')) return 'consumer';
  return 'consumer';
}

function getWelcomeMessage(role, language) {
  if (language === 'en') {
    if (role === 'b2b') {
      return 'Welcome to the Control Center. I am your operations assistant. How can I support your agency today?';
    }
    return 'Dear family member, we are here to listen and support you in this delicate moment. Ask anything about the process or service here.';
  }
  if (role === 'b2b') {
    return 'Benvenuto nel Centro di Controllo, Partner. Sono il tuo assistente gestionale. Come posso supportare le operazioni della tua agenzia oggi?';
  }
  return 'Gentile familiare, siamo qui per ascoltarla e aiutarla in questo momento delicato. Se ha dubbi sulle pratiche o sul servizio, chieda pure qui.';
}

function getPageContext(pathname, language) {
  if (pathname.includes('/b2b/dashboard')) {
    const liveContext =
      typeof window !== 'undefined' ? window.localStorage.getItem('lugubrious-page-context') : '';
    if (liveContext) return liveContext;

    if (language === 'en') {
      return 'Current page: Agency Dashboard analytics with performance trends and year comparison.';
    }
    return 'Pagina corrente: Dashboard Agenzia analitica con trend performance e confronto tra anni.';
  }
  if (pathname.includes('/consumer/dashboard')) {
    const liveContext =
      typeof window !== 'undefined' ? window.localStorage.getItem('lugubrious-page-context') : '';
    if (liveContext) return liveContext;

    return language === 'en'
      ? 'Current page: Family dashboard with progress timeline, memory gallery, assigned specialist and document vault.'
      : 'Pagina corrente: Dashboard Famiglia con timeline pratica, galleria memoria, referente dedicato e caveau documentale.';
  }
  if (pathname.includes('/profile') || pathname.includes('/settings')) {
    const liveContext =
      typeof window !== 'undefined' ? window.localStorage.getItem('lugubrious-page-context') : '';
    if (liveContext) return liveContext;
    return language === 'en'
      ? 'Current page: Family profile or settings. Support requests may include emergency contacts and vault permissions.'
      : 'Pagina corrente: Profilo o impostazioni famiglia. Le richieste possono riguardare contatti di emergenza e permessi del vault.';
  }
  return '';
}

function renderFormattedMessage(content) {
  const normalized = content
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*[•]\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  const cleaned = normalized.replace(/\*/g, '');

  const parts = cleaned.split(/(<b>.*?<\/b>)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <b key={idx}>{part.slice(3, -4)}</b>;
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function ChatAssistant() {
  const pathname = usePathname();
  const role = useMemo(() => getRoleFromPath(pathname), [pathname]);
  const { language } = useLanguage();
  const t = copy[language].chat;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messageListRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage(role, language) }]);
    }
  }, [isOpen, messages.length, role, language]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'assistant', content: getWelcomeMessage(role, language) }]);
    }
  }, [language, role, isOpen]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          role,
          language,
          pageContext: getPageContext(pathname, language)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.connectionError);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      const text = error instanceof Error ? error.message : t.connectionError;
      setMessages((prev) => [...prev, { role: 'assistant', content: `${t.prefixError} ${text}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-4 sm:right-4">
      {isOpen ? (
        <div className="mb-2 flex h-[64vh] w-[calc(100vw-1.2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl backdrop-blur sm:mb-3 sm:h-[560px]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{t.assistant}</p>
              <p className="text-xs text-slate-300">{role === 'b2b' ? t.agencyMode : t.familyMode}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:bg-white/10"
              aria-label={t.closeAria}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white'
                      : 'border border-white/10 bg-white/[0.05] text-slate-200'
                  } font-sans whitespace-pre-line`}
                >
                  {renderFormattedMessage(msg.content)}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300">
                  {t.writing}
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="field"
                placeholder={t.placeholder}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={t.sendAria}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-xl transition hover:from-sky-400 hover:to-violet-400"
        aria-label={t.openAria}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
