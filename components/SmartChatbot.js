'use client';

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
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function MarkdownContent({ content }) {
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

function MessageRenderer({ message, t, onOcrAction, mode }) {
  if (message.type === 'summaryCard') {
    return (
      <div className="max-w-[88%] rounded-2xl border border-violet-300/20 bg-violet-500/[0.08] p-3">
        <p className="font-serif text-base text-white">{t.agencySummary.title}</p>
        <div className="mt-2 grid gap-2 text-sm text-slate-200">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
              {t.agencySummary.revenueLabel}
            </span>
            <p className="mt-1 text-white">{t.agencySummary.revenueValue}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
              {t.agencySummary.casesLabel}
            </span>
            <p className="mt-1 text-white">{t.agencySummary.casesValue}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">
              {t.agencySummary.fleetLabel}
            </span>
            <p className="mt-1 text-white">{t.agencySummary.fleetValue}</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'ocrAction') {
    return (
      <div className="max-w-[88%] rounded-2xl border border-sky-300/30 bg-sky-500/[0.08] p-3">
        <p className="text-sm text-slate-100">{message.content}</p>
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

  if (message.type === 'safety') {
    return (
      <div className="max-w-[88%] rounded-2xl border border-amber-300/30 bg-amber-500/[0.08] p-3">
        <p className="text-sm text-slate-100">{message.content}</p>
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

  return (
    <div
      className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm ${
        message.role === 'user'
          ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white'
          : 'border border-white/10 bg-white/[0.05] text-slate-200'
      }`}
    >
      {message.role === 'assistant' ? <MarkdownContent content={message.content} /> : message.content}
    </div>
  );
}

export default function SmartChatbot({ mode = 'family' }) {
  const { language } = useLanguage();
  const t = copy[language].chatSmart;
  const modeKey = mode === 'agency' ? 'agency' : 'family';
  const modeCopy = t.modes[modeKey];

  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef(null);
  const docsInputRef = useRef(null);
  const mediaInputRef = useRef(null);

  const chipLabels = useMemo(() => modeCopy.chips, [modeCopy]);

  const pushAssistantMessage = (message) => {
    setMessages((prev) => [...prev, { role: 'assistant', ...message }]);
  };

  const scrollDown = () => {
    window.requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  };

  const requestSmartReply = async (message) => {
    setIsTyping(true);
    try {
      const pageContext = window.localStorage.getItem('lugubrious-page-context') || '';
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          role: modeKey === 'agency' ? 'b2b' : 'consumer',
          language,
          pageContext
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.responses.common.defaultReply);
      }

      pushAssistantMessage({ type: 'text', content: data.reply });
    } catch {
      pushAssistantMessage({ type: 'text', content: t.responses.common.defaultReply });
    } finally {
      setIsTyping(false);
      scrollDown();
    }
  };

  const handleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && messages.length === 0) {
        setMessages([{ role: 'assistant', type: 'text', content: modeCopy.welcome }]);
      }
      return next;
    });
  };

  const handleChip = async (label) => {
    setMessages((prev) => [...prev, { role: 'user', type: 'text', content: label }]);

    if (modeKey === 'agency' && label === modeCopy.chips[1]) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 850));
      pushAssistantMessage({ type: 'summaryCard', content: '' });
      setIsTyping(false);
      scrollDown();
      return;
    }

    await requestSmartReply(label);
  };

  const handleOcrAction = async (action) => {
    const actionPrompt = action === 'prefill' ? t.ocrActions.prefill : t.ocrActions.cancel;
    setMessages((prev) => [...prev, { role: 'user', type: 'text', content: actionPrompt }]);
    await requestSmartReply(actionPrompt);
  };

  const handleFiles = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', type: 'text', content: formatTemplate(t.fileUploaded, { name: file.name }) }
    ]);

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');

    if (modeKey === 'agency' && isImage) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      pushAssistantMessage({ type: 'ocrAction', content: t.responses.agency.ocr });
      setIsTyping(false);
      scrollDown();
      return;
    }

    if (modeKey === 'family' && isPdf) {
      await requestSmartReply(`${modeCopy.chips[0]}: ${file.name}`);
      return;
    }

    await requestSmartReply(file.name);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: 'user', type: 'text', content: trimmed }]);
    setInput('');

    const lower = trimmed.toLowerCase();
    const triggerSafety =
      modeKey === 'family' &&
      (lower.includes('non capisco') || lower.includes('aiuto') || lower.includes('confuso') || lower.includes('help') || lower.includes('lost'));

    if (triggerSafety) {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      pushAssistantMessage({ type: 'safety', content: t.responses.family.safety });
      setIsTyping(false);
      scrollDown();
      return;
    }

    await requestSmartReply(trimmed);
  };

  const startRecording = () => {
    if (!isTyping) setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setMessages((prev) => [...prev, { role: 'user', type: 'text', content: t.voiceCaptured }]);
    await requestSmartReply(t.voiceCaptured);
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
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-serif text-lg text-white">{t.title}</p>
                <p className="text-xs text-slate-300">{modeCopy.subtitle}</p>
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
              <div className="border-b border-white/5 px-3 py-2">
                <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
                  {chipLabels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleChip(label)}
                      disabled={isTyping}
                      className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-200 transition hover:border-violet-300/40 hover:bg-violet-500/[0.12] disabled:opacity-60"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={messagesRef}
                className="h-[calc(100%-3.25rem)] overflow-y-auto px-3 py-3 [scrollbar-color:rgba(148,163,184,0.3)_transparent] [scrollbar-width:thin]"
              >
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <MessageRenderer
                        message={msg}
                        t={t}
                        mode={modeKey}
                        onOcrAction={handleOcrAction}
                      />
                    </div>
                  ))}
                  {isTyping ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-300">
                        {t.typing}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

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

            <div className="border-t border-white/10 p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  ref={docsInputRef}
                  type="file"
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                  disabled={isTyping}
                />
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                  disabled={isTyping}
                />
                <button
                  type="button"
                  aria-label={t.uploadDocAria}
                  onClick={() => docsInputRef.current?.click()}
                  disabled={isTyping}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.1] disabled:opacity-60"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t.uploadMediaAria}
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={isTyping}
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
                  disabled={isTyping}
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

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={t.placeholder}
                  disabled={isTyping}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/60 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
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
