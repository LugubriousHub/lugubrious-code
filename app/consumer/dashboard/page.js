'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Check,
  Clock3,
  Download,
  FileAudio2,
  FileImage,
  FileVideo2,
  MessageSquare,
  Phone,
  UserRound,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

const MEMORY_SLOTS = 6;
const CURRENT_GUIDE_STEP = 1;
const GUIDE_COMPLETED_TIMES = ['10:10', '10:35', '11:20'];

function detectLegacyType(file) {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'photo';
}

export default function ConsumerDashboardPage() {
  const { language } = useLanguage();
  const t = copy[language].consumerDashboard;

  const [memoryFiles, setMemoryFiles] = useState(Array.from({ length: MEMORY_SLOTS }, () => null));
  const [legacyItems, setLegacyItems] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [quickReason, setQuickReason] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [flowers, setFlowers] = useState(() =>
    t.flowerItems.map((item) => ({ ...item, status: 'pending' }))
  );
  const [thanksPreview, setThanksPreview] = useState('');

  const inputRefs = useRef([]);
  const legacyInputRef = useRef(null);

  useEffect(() => {
    setFlowers(t.flowerItems.map((item) => ({ ...item, status: 'pending' })));
    setThanksPreview('');
  }, [language, t.flowerItems]);

  useEffect(() => {
    const approvedCount = flowers.filter((item) => item.status === 'approved').length;
    const pendingCount = flowers.filter((item) => item.status === 'pending').length;
    const completedSteps = Math.min(CURRENT_GUIDE_STEP, t.guideSteps72h.length);

    const context =
      language === 'it'
        ? `Pagina corrente: Dashboard Famiglia con Legacy Vault, guida 72 ore e sezione Fiori e Omaggi. Elementi nel vault: ${legacyItems.length}. Passi completati: ${completedSteps}/${t.guideSteps72h.length}. Omaggi approvati: ${approvedCount}, in attesa: ${pendingCount}.`
        : `Current page: Family Dashboard with Legacy Vault, 72-hour guide and Flowers & Tributes section. Vault items: ${legacyItems.length}. Completed steps: ${completedSteps}/${t.guideSteps72h.length}. Approved tributes: ${approvedCount}, pending: ${pendingCount}.`;

    window.localStorage.setItem('lugubrious-page-context', context);
  }, [language, legacyItems.length, t.guideSteps72h.length, flowers]);

  const openPicker = (index) => {
    inputRefs.current[index]?.click();
  };

  const handleMemoryChange = (index, file) => {
    if (!file) return;

    setMemoryFiles((prev) => {
      const next = [...prev];
      if (next[index]?.url) URL.revokeObjectURL(next[index].url);
      next[index] = { name: file.name, url: URL.createObjectURL(file) };
      return next;
    });
  };

  const handleLegacyUpload = (file) => {
    if (!file) return;

    const type = detectLegacyType(file);
    setLegacyItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: file.name, type, createdAt: new Date().toISOString() }
    ]);
  };

  const updateFlowerStatus = (id, status) => {
    setFlowers((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const closeQuickModal = () => {
    if (isSending) return;
    setIsMessageModalOpen(false);
  };

  const handleQuickSubmit = (event) => {
    event.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsMessageModalOpen(false);
      setQuickReason('');
      setQuickMessage('');
      window.alert(t.quickModalSuccess);
    }, 1500);
  };

  const generateThanks = () => {
    const approved = flowers.filter((item) => item.status === 'approved');
    const names = approved.map((item) => item.sender).join(', ');

    if (language === 'it') {
      setThanksPreview(
        approved.length > 0
          ? `La famiglia ringrazia con sincera gratitudine ${names} per la vicinanza e gli omaggi floreali ricevuti. La vostra presenza e il vostro affetto ci accompagnano in questo momento delicato.`
          : 'La famiglia ringrazia di cuore per ogni messaggio di vicinanza e per il sostegno ricevuto in queste ore. Il vostro affetto e una presenza preziosa.'
      );
      return;
    }

    setThanksPreview(
      approved.length > 0
        ? `The family sincerely thanks ${names} for their support and floral tributes. Your closeness and kindness are deeply meaningful during this delicate time.`
        : 'The family warmly thanks everyone for their messages of support and heartfelt presence during these difficult hours. Your kindness means a lot.'
    );
  };

  const legacyTypeIcon = useMemo(
    () => ({
      photo: <FileImage className="h-4 w-4 text-sky-300" />,
      video: <FileVideo2 className="h-4 w-4 text-violet-300" />,
      audio: <FileAudio2 className="h-4 w-4 text-emerald-300" />
    }),
    []
  );

  return (
    <main className="grid gap-4">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <article className="surface-soft p-6">
          <h2 className="text-4xl font-semibold">{t.title}</h2>
          <p className="mt-2 text-slate-300">{t.subtitle}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t.caseCode}</p>
              <p className="mt-1 font-semibold text-white">LH-2026-041</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">{t.currentStatus}</p>
              <p className="mt-1 font-semibold text-white">{t.currentStatusValue}</p>
            </article>
          </div>
        </article>

        <article className="rounded-2xl bg-gradient-to-r from-sky-500/50 via-violet-500/45 to-sky-500/50 p-[1px]">
          <div className="h-full rounded-2xl bg-[#020617] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{t.agentLabel}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                  <Building2 className="h-4 w-4 text-violet-300" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.agencyName}</p>
                  <a
                    href="https://maps.google.com/?q=Via+Roma+45,+Milano"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-slate-300"
                  >
                    {t.agencyAddress} - {t.agencyMaps}
                  </a>
                </div>
              </div>
              <hr className="my-4 border-white/5" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05]">
                  <UserRound className="h-5 w-5 text-sky-300" />
                </span>
                <div>
                  <p className="font-semibold text-white">Martina Colombo</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{t.agentRole}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <a
                href="tel:+39021234567"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08]"
              >
                <Phone className="h-4 w-4 text-sky-300" />
                {t.callAgent}
              </a>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/[0.08]"
              >
                <MessageSquare className="h-4 w-4 text-violet-300" />
                {t.quickMessage}
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="surface-soft p-6">
        <h3 className="text-3xl font-semibold">{t.timeline}</h3>
        <div className="mt-5 grid gap-4">
          {t.steps.map((step, index) => (
            <div key={step.title} className="grid grid-cols-[26px_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 h-4 w-4 rounded-full ${
                    step.done ? 'bg-emerald-500' : 'border-2 border-slate-400'
                  }`}
                />
                {index < t.steps.length - 1 ? <span className="mt-1 h-full w-px bg-white/20" /> : null}
              </div>
              <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-white">{`Step ${index + 1}: ${step.title}`}</p>
                <p className="mt-1 text-sm text-slate-300">{step.detail}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-soft p-6">
        <h3 className="text-3xl font-semibold">{t.memoryTitle}</h3>
        <p className="mt-2 text-slate-300">{t.memoryDescription}</p>

        <div className="mt-5 overflow-x-auto pb-2">
          <div className="grid min-w-[760px] grid-cols-3 gap-3 md:min-w-0 md:grid-cols-3">
            {memoryFiles.map((item, index) => (
              <button
                key={`memory-slot-${index}`}
                type="button"
                onClick={() => openPicker(index)}
                className="rounded-2xl bg-gradient-to-r from-sky-500/40 via-violet-500/35 to-sky-500/40 p-[1px] text-left"
              >
                <span className="block h-full rounded-2xl border border-white/10 bg-[#020617] p-3">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMemoryChange(index, e.target.files?.[0])}
                  />

                  {item ? (
                    <>
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-24 w-full rounded-lg border border-white/10 object-cover"
                      />
                      <p className="mt-2 truncate text-xs text-slate-300">{item.name}</p>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                        <FileImage className="h-4 w-4 text-sky-300" />
                      </span>
                      <p className="mt-3 text-sm text-white">{t.memoryUpload}</p>
                      <p className="mt-1 text-xs text-slate-400">{t.memoryEmpty}</p>
                    </>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-soft p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-3xl font-semibold">{t.legacyTitle}</h3>
            <p className="mt-2 text-slate-300">{t.legacyDescription}</p>
          </div>

          <button type="button" onClick={() => legacyInputRef.current?.click()} className="btn-primary">
            {t.legacyUpload}
          </button>
          <input
            ref={legacyInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            className="hidden"
            onChange={(e) => handleLegacyUpload(e.target.files?.[0])}
          />
        </div>

        <div className="mt-5 overflow-x-auto pb-2">
          <div className="grid min-w-[920px] grid-cols-4 gap-3 md:min-w-0 md:grid-cols-4">
            {legacyItems.length === 0 ? (
              <article className="col-span-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                {t.legacyEmpty}
              </article>
            ) : (
              legacyItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    {legacyTypeIcon[item.type]}
                  </span>
                  <p className="mt-3 truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{t.legacyTypes[item.type]}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="surface-soft p-6">
        <h3 className="text-3xl font-semibold">{t.guideTitle}</h3>
        <p className="mt-2 text-slate-300">{t.guideSubtitle}</p>

        <div className="mt-4 grid gap-3">
          {t.guideSteps72h.map((step, index) => {
            const isCompleted = index < CURRENT_GUIDE_STEP;
            const isCurrent = index === CURRENT_GUIDE_STEP;
            const isFuture = index > CURRENT_GUIDE_STEP;

            return (
              <article
                key={step.title}
                className={`rounded-xl border p-4 ${
                  isCurrent
                    ? 'border-sky-400/60 bg-sky-500/[0.08] shadow-[0_0_30px_rgba(99,102,241,0.22)]'
                    : 'border-white/10 bg-white/[0.04]'
                } ${isCompleted ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="inline-flex items-start gap-2 text-left">
                    {isCompleted ? (
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-500/20">
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      </span>
                    ) : isCurrent ? (
                      <span className="mt-1 inline-flex h-3.5 w-3.5 animate-pulse rounded-full bg-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.8)]" />
                    ) : (
                      <span className="mt-0.5 inline-flex h-5 w-5 rounded-full border-2 border-slate-500" />
                    )}
                    <span>
                      <p className={`text-sm font-semibold ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">{step.detail}</p>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStep(step)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.08]"
                  >
                    {t.details}
                  </button>
                </div>

                {isCompleted ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-300">
                    <Clock3 className="h-3.5 w-3.5" /> {t.completedAt} {GUIDE_COMPLETED_TIMES[index] ?? '10:30'}
                  </p>
                ) : isCurrent ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-sky-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-sky-300" />
                    {t.guideInProgress}
                  </p>
                ) : isFuture ? null : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="surface-soft p-6">
        <h3 className="text-3xl font-semibold">{t.flowersTitle}</h3>
        <p className="mt-2 text-slate-300">{t.flowersSubtitle}</p>

        <div className="mt-4 overflow-x-auto pb-2">
          <div className="space-y-3 min-w-[780px] md:min-w-0">
            {flowers.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.sender}</p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateFlowerStatus(item.id, 'approved')}
                        className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/20"
                      >
                        {t.approve}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFlowerStatus(item.id, 'declined')}
                        className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
                      >
                        {t.decline}
                      </button>
                    </>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'approved'
                          ? 'border border-emerald-300/40 bg-emerald-500/10 text-emerald-200'
                          : 'border border-rose-300/40 bg-rose-500/10 text-rose-200'
                      }`}
                    >
                      {item.status === 'approved' ? t.approved : t.declined}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <button type="button" onClick={generateThanks} className="btn-secondary">
            {t.generateThanks}
          </button>

          {thanksPreview ? (
            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <p className="text-sm font-semibold text-white">{t.thanksPreviewTitle}</p>
              <p className="mt-2 text-sm text-slate-300">{thanksPreview}</p>
              <p className="mt-2 text-xs text-slate-400">{t.sendVia}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="surface-soft p-6">
        <h3 className="text-3xl font-semibold">{t.documentsTitle}</h3>
        <p className="mt-2 text-slate-300">{t.documentsSubtitle}</p>

        <div className="mt-4 grid gap-3">
          {t.docs.map((doc) => (
            <article
              key={doc.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div>
                <p className="font-medium text-white">{doc.name}</p>
                <p className="text-xs text-slate-400">{doc.info}</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200 hover:bg-white/[0.08]"
              >
                <Download className="h-4 w-4" />
                {t.download}
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedStep ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#020617]/70 p-4 backdrop-blur-sm">
          <article className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1224] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-xl font-semibold text-white">{selectedStep.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedStep(null)}
                className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:bg-white/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{selectedStep.modalText}</p>
            <button type="button" onClick={() => setSelectedStep(null)} className="btn-secondary mt-4">
              {t.closeModal}
            </button>
          </article>
        </div>
      ) : null}

      <AnimatePresence>
        {isMessageModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.article
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xl font-semibold text-white">{t.quickModalTitle}</h4>
                <button
                  type="button"
                  onClick={closeQuickModal}
                  className="rounded-lg border border-white/10 p-1.5 text-slate-300 hover:bg-white/[0.08]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.quickModalIntro}</p>

              <form onSubmit={handleQuickSubmit} className="mt-5 grid gap-4">
                <label className="grid gap-1 text-sm text-slate-200">
                  {t.quickModalReason}
                  <select
                    value={quickReason}
                    onChange={(e) => setQuickReason(e.target.value)}
                    required
                    className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="" disabled>
                      --
                    </option>
                    {t.quickModalReasons.map((reason) => (
                      <option key={reason} value={reason} className="bg-[#0B0F19] text-white">
                        {reason}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 text-sm text-slate-200">
                  {t.quickModalMessage}
                  <textarea
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    required
                    rows={5}
                    className="h-32 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    placeholder={t.quickModalMessagePlaceholder}
                  />
                </label>

                <div className="mt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeQuickModal}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.08]"
                  >
                    {t.quickModalCancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                      isSending ? 'animate-pulse' : ''
                    }`}
                  >
                    {isSending ? t.quickModalSending : t.quickModalSend}
                  </button>
                </div>
              </form>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
