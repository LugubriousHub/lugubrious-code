'use client';

import { useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

function Icon({ path, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NecrologiPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bNecrologi;

  const [name, setName] = useState('');
  const [traits, setTraits] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError(t.nameError);
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const response = await fetch('/api/generate-obituary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          traits,
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.connectionError);
      }

      setText(data.text || t.emptyText);
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : t.connectionError);
    }
  };

  const handlePublish = () => {
    window.alert(t.publishDone);
  };

  return (
    <section>
      <div className="flex items-center gap-3">
        <Icon path="M12 6v12 M6 12h12" className="h-6 w-6 text-slate-300" />
        <h2 className="text-4xl font-semibold">{t.title}</h2>
      </div>
      <p className="mt-2 text-slate-300">{t.subtitle}</p>

      <div className="surface-soft mt-6 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-200">
            {t.name}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              placeholder={t.placeholderName}
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            {t.traits}
            <input
              value={traits}
              onChange={(e) => setTraits(e.target.value)}
              className="field"
              placeholder={t.placeholderTraits}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            disabled={status === 'loading'}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? t.generateLoading : t.generateIdle}
          </button>

          <button onClick={handlePublish} className="btn-secondary">
            {t.publish}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

        <label className="mt-5 grid gap-1 text-sm text-slate-200">
          {t.generated}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="field"
            placeholder={t.placeholderText}
          />
        </label>
      </div>
    </section>
  );
}
