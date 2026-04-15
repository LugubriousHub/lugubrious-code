'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MessageCircle,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Upload,
  Waves,
  X
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { copy } from '../app/lib/translations';

// Badge colore per agente attivo
const AGENT_BADGE = {
  manager:   { color: '#94A3B8', label: { it: 'Analisi',        en: 'Analysing'     } },
  discovery: { color: '#6475FA', label: { it: 'Qualificazione', en: 'Qualification' } },
  sales:     { color: '#E8650A', label: { it: 'Consulenza',     en: 'Consultation'  } },
  support:   { color: '#22C55E', label: { it: 'Assistenza',     en: 'Support'       } },
};

// Prefisso per messaggi card locali (non inviati all'API come history)
const CARD_PREFIX = '__card:';

function isCardContent(content) {
  return typeof content === 'string' && content.startsWith(CARD_PREFIX);
}

function parseCard(content) {
  try {
    return JSON.parse(content.slice(CARD_PREFIX.length));
  } catch {
    return null;
  }
}

function formatTemplate(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function BubbleIcon({ isRecording }) {
  if (!isRecording) {
    return <MessageCircle className="h-6 w-6" />;
  }

  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2].map((bar) => (
        <motion.span
          key={bar}
          className="w-1 rounded-full bg-gradient-to-t from-blue-300 to-violet-200"
          animate={{ height: [6, 16, 8] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: bar * 0.15, ease: 'easeInOut' }}
        />
      ))}
      <Waves className="h-4 w-4 text-white/90" />
    </div>
  );
}

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

function parseTableRows(lines, startIndex) {
  const rows = [];
  let i = startIndex;
  while (i < lines.length && lines[i].includes('|')) {
    rows.push(lines[i]);
    i += 1;
  }
  return { rows, nextIndex: i };
}

function parseTableLine(line) {
  return line.split('|').map((cell) => cell.trim()).filter(Boolean);
}

function MarkdownContent({ content, isStreaming }) {
  // Durante lo streaming non mostrare tabelle parziali
  if (isStreaming) {
    return (
      <div className="space-y-1.5">
        {content.split('\n').filter(Boolean).map((line, i) => (
          <p key={i} className="leading-relaxed text-slate-100">{renderInlineMarkdown(line.replace(/^#+\s*/, '').replace(/^\s*[\-*]\s*/, ''))}</p>
        ))}
      </div>
    );
  }

  const lines = content.split('\n');
  const blocks = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();

    if (!line) {
      blocks.push(<div key={`sp-${i}`} className="h-1" />);
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h4 key={`h3-${i}`} className="font-serif text-base text-white">
          {renderInlineMarkdown(line.replace(/^###\s+/, ''))}
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={`h2-${i}`} className="font-serif text-lg text-white">
          {renderInlineMarkdown(line.replace(/^##\s+/, ''))}
        </h3>
      );
      continue;
    }

    const nextLine = lines[i + 1]?.trim() ?? '';
    const isTableHeader = line.includes('|') && /^\|?\s*:?-{3,}/.test(nextLine.replace(/\|/g, ''));

    if (isTableHeader) {
      const { rows, nextIndex } = parseTableRows(lines, i);
      const header = parseTableLine(rows[0] || '');
      const dataRows = rows.slice(2).map((row) => parseTableLine(row));

      blocks.push(
        <div key={`tbl-${i}`} className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[240px] border-collapse text-xs">
            <thead className="bg-white/[0.05] text-slate-200">
              <tr>
                {header.map((cell, cellIdx) => (
                  <th key={`h-${cellIdx}`} className="px-2 py-1.5 text-left font-semibold">
                    {renderInlineMarkdown(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIdx) => (
                <tr key={`r-${rowIdx}`} className="border-t border-white/10 text-slate-200">
                  {row.map((cell, cellIdx) => (
                    <td key={`c-${rowIdx}-${cellIdx}`} className="px-2 py-1.5">
                      {renderInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      i = nextIndex - 1;
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed text-slate-100">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  return <div className="space-y-1.5">{blocks}</div>;
}

function MessageRenderer({ message, t, onOcrAction, mode, isStreaming }) {
  if (isCardContent(message.content)) {
    const card = parseCard(message.content);
    if (!card) return null;

    if (card.type === 'summaryCard') {
      return (
        <div className="max-w-[88%] rounded-2xl border border-violet-300/20 bg-violet-500/[0.08] p-3">
          <p className="font-serif text-base text-white">{t.agencySummary.title}</p>
          <div className="mt-2 grid gap-2 text-sm text-slate-200">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t.agencySummary.revenueLabel}</span>
              <p className="mt-1 text-white">{t.agencySummary.revenueValue}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t.agencySummary.casesLabel}</span>
              <p className="mt-1 text-white">{t.agencySummary.casesValue}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{t.agencySummary.fleetLabel}</span>
              <p className="mt-1 text-white">{t.agencySummary.fleetValue}</p>
            </div>
          </div>
        </div>
      );
    }

    if (card.type === 'ocrAction') {
      return (
        <div className="max-w-[88%] rounded-2xl border border-sky-300/30 bg-sky-500/[0.08] p-3">
          <p className="text-sm text-slate-100">{card.content}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOcrAction('prefill')}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white transition hover:bg-white/[0.12]"
            >
              {t.ocrActions.prefill}
            </button>
            <button
              type="button"
              onClick={() => onOcrAction('cancel')}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.08]"
            >
              {t.ocrActions.cancel}
            </button>
          </div>
        </div>
      );
    }

    if (card.type === 'safety') {
      return (
        <div className="max-w-[88%] rounded-2xl border border-amber-300/30 bg-amber-500/[0.08] p-3">
          <p className="text-sm text-slate-100">{card.content}</p>
          {mode === 'family' ? (
            <button
              type="button"
              className="mt-3 rounded-lg border border-amber-200/30 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-100 transition hover:bg-amber-300/20"
            >
              {t.callCoordinator}
            </button>
          ) : null}
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
        message.role === 'user'
          ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white'
          : 'border border-white/10 bg-white/[0.05] text-slate-200'
      }`}
    >
      {message.role === 'assistant'
        ? <MarkdownContent content={message.content} isStreaming={isStreaming} />
        : message.content}
    </div>
  );
}

export default function SmartChatbot({ mode = 'family' }) {
  const { language } = useLanguage();
  const t = copy[language].chatSmart;
  const modeKey = mode === 'agency' ? 'agency' : mode === 'generic' ? 'generic' : 'family';
  const modeCopy = t.modes[modeKey];
  const flow = modeKey === 'agency' ? 'b2b' : modeKey === 'generic' ? 'generic' : 'b2c';

  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeAgent, setActiveAgent] = useState('discovery');
  const [isRouting, setIsRouting] = useState(false);

  const messagesRef = useRef(null);
  const docsInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const activeAgentRef = useRef('discovery');

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    body: { flow, language, currentAgent: activeAgentRef.current },
    onResponse: (response) => {
      setIsRouting(false);
      const agent = response.headers.get('X-Active-Agent');
      if (agent && AGENT_BADGE[agent]) {
        setActiveAgent(agent);
        activeAgentRef.current = agent;
      }
    },
    onError: () => {
      setIsRouting(false);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'assistant', content: t.responses.common.defaultReply },
      ]);
    },
  });

  const chipLabels = useMemo(() => modeCopy.chips, [modeCopy]);

  const scrollDown = () => {
    window.requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  };

  const injectCard = (cardData) => {
    setMessages((prev) => [
      ...prev,
      { id: `card-${Date.now()}`, role: 'assistant', content: `${CARD_PREFIX}${JSON.stringify(cardData)}` },
    ]);
    scrollDown();
  };

  const handleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && messages.length === 0) {
        setMessages([{ id: 'welcome-0', role: 'assistant', content: modeCopy.welcome }]);
      }
      return next;
    });
  };

  const handleChip = async (label) => {
    if (isLoading) return;

    // "Riassunto Giornata" chip in agency mode → card locale, nessuna richiesta API
    if (modeKey === 'agency' && label === modeCopy.chips[1]) {
      setMessages((prev) => [...prev, { id: `chip-${Date.now()}`, role: 'user', content: label }]);
      setTimeout(() => injectCard({ type: 'summaryCard' }), 850);
      return;
    }

    setIsRouting(true);
    await append({ role: 'user', content: label });
    scrollDown();
  };

  const handleOcrAction = async (action) => {
    if (isLoading) return;
    const actionPrompt = action === 'prefill' ? t.ocrActions.prefill : t.ocrActions.cancel;
    setIsRouting(true);
    await append({ role: 'user', content: actionPrompt });
    scrollDown();
  };

  const handleFiles = async (fileList) => {
    const file = fileList?.[0];
    if (!file || isLoading) return;

    const uploadMsg = formatTemplate(t.fileUploaded, { name: file.name });
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');

    if (modeKey === 'agency' && isImage) {
      setMessages((prev) => [...prev, { id: `file-${Date.now()}`, role: 'user', content: uploadMsg }]);
      setTimeout(() => injectCard({ type: 'ocrAction', content: t.responses.agency.ocr }), 900);
      return;
    }

    if (modeKey === 'family' && isPdf) {
      setIsRouting(true);
      await append({ role: 'user', content: `${modeCopy.chips[0]}: ${file.name}` });
      scrollDown();
      return;
    }

    setIsRouting(true);
    await append({ role: 'user', content: uploadMsg });
    scrollDown();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Rilevamento distress per utenti famiglia → safety card locale, nessuna richiesta API
    const lower = trimmed.toLowerCase();
    const triggerSafety =
      modeKey === 'family' &&
      (lower.includes('non capisco') ||
        lower.includes('aiuto') ||
        lower.includes('confuso') ||
        lower.includes('help') ||
        lower.includes('lost'));

    if (triggerSafety) {
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content: trimmed }]);
      setTimeout(() => injectCard({ type: 'safety', content: t.responses.family.safety }), 900);
      // Reset input manualmente perché non usiamo handleSubmit
      handleInputChange({ target: { value: '' } });
      return;
    }

    setIsRouting(true);
    handleSubmit(event);
    scrollDown();
  };

  const startRecording = () => {
    if (!isLoading) setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsRouting(true);
    await append({ role: 'user', content: t.voiceCaptured });
    scrollDown();
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    await handleFiles(event.dataTransfer.files);
  };

  const displayedAgent = isRouting ? 'manager' : activeAgent;
  const agentBadge = AGENT_BADGE[displayedAgent];
  const langKey = language === 'en' ? 'en' : 'it';

  // L'ultimo messaggio assistant è quello in streaming se isLoading è true
  const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf('assistant');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="mb-3 flex h-[600px] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/90 shadow-2xl backdrop-blur-3xl"
          >
            {/* Header con agent badge */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-serif text-lg text-white">{t.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-300">{modeCopy.subtitle}</p>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={displayedAgent}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                      style={{ color: agentBadge.color, borderColor: `${agentBadge.color}40` }}
                    >
                      {agentBadge.label[langKey]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpen}
                aria-label={t.closeAria}
                className="rounded-lg border border-white/10 p-1.5 text-slate-300 transition hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className="relative flex-1 overflow-hidden"
              onDragOver={onDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
            >
              {/* Quick action chips */}
              <div className="border-b border-white/5 px-3 py-2">
                <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
                  {chipLabels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleChip(label)}
                      disabled={isLoading}
                      className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200 transition hover:border-violet-300/40 hover:bg-violet-500/[0.12] disabled:opacity-60"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesRef}
                className="h-[calc(100%-3.25rem)] overflow-y-auto px-3 py-3 [scrollbar-color:rgba(148,163,184,0.3)_transparent] [scrollbar-width:thin]"
              >
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div key={msg.id ?? `${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <MessageRenderer
                        message={msg}
                        t={t}
                        mode={modeKey}
                        onOcrAction={handleOcrAction}
                        isStreaming={isLoading && idx === lastAssistantIdx}
                      />
                    </div>
                  ))}
                  {isLoading && (messages[messages.length - 1]?.role !== 'assistant') ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300">
                        {t.typing}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Drag-over overlay */}
              <AnimatePresence>
                {isDragging ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 grid place-items-center bg-[#0B0F19]/80 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                      className="rounded-2xl border border-violet-300/30 bg-white/[0.04] px-5 py-4 text-center"
                    >
                      <Upload className="mx-auto h-5 w-5 text-violet-200" />
                      <p className="mt-2 text-sm text-slate-100">{t.dropOverlay}</p>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  ref={docsInputRef}
                  type="file"
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                  disabled={isLoading}
                />
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  aria-label={t.uploadDocAria}
                  onClick={() => docsInputRef.current?.click()}
                  disabled={isLoading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.1] disabled:opacity-60"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t.uploadMediaAria}
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={isLoading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.1] disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t.voiceAria}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  disabled={isLoading}
                  className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-xs transition disabled:opacity-60 ${
                    isRecording
                      ? 'border-violet-300/40 bg-violet-500/20 text-violet-100'
                      : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.1]'
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                  {t.holdToTalk}
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={t.sendAria}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label={t.openAria}
        animate={modeKey === 'family' && !isOpen ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={modeKey === 'family' && !isOpen ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-xl transition hover:from-sky-400 hover:to-violet-400"
      >
        {isRecording ? (
          <BubbleIcon isRecording />
        ) : (
          <div className="relative">
            <BubbleIcon />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-white/85" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
