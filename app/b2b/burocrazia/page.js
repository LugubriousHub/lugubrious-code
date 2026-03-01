'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

function ActionButton({ status, idleLabel, loadingLabel, successLabel, onClick, variant = 'primary' }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
        {successLabel}
      </span>
    );
  }

  const className =
    variant === 'secondary'
      ? 'btn-secondary disabled:cursor-not-allowed disabled:opacity-70'
      : 'btn-primary disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <button
      onClick={onClick}
      disabled={status === 'loading'}
      className={`${className} ${status === 'loading' ? 'animate-pulse' : ''}`}
    >
      {status === 'loading' ? loadingLabel : idleLabel}
    </button>
  );
}

export default function BurocraziaPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bBurocrazia;

  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    deathDate: '',
    deathPlace: '',
    notes: ''
  });
  const pdfTemplateRef = useRef(null);

  const runMockAction = (setter) => {
    setter('loading');
    setTimeout(() => setter('success'), 1500);
  };

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleGeneratePDF = async () => {
    if (!pdfTemplateRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      if (document?.fonts?.ready) {
        await document.fonts.ready;
      }
      const canvas = await html2canvas(pdfTemplateRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const safeName = (formData.name || 'Pratica').replace(/\s+/g, '_').replace(/[^\w-]/g, '');
      pdf.save(`Protocollo_Comune_${safeName}.pdf`);
      setToastMessage(language === 'it' ? 'Documento generato con successo' : 'Document generated successfully');
    } catch (error) {
      // Keep UX stable in demo mode if browser blocks capture.
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setToastMessage(''), 2600);
    }
  };

  const generatedAt = new Intl.DateTimeFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date());

  const pdfText =
    language === 'it'
      ? {
          title: 'COMUNICAZIONE ANAGRAFICA DI DECESSO',
          subtitle: 'Certificato Anagrafico Digitale',
          sectionData: 'DATI ANAGRAFICI',
          protocol: 'PROTOCOLLO: LH-2026/02',
          labels: {
            name: 'Nome e Cognome',
            taxId: 'Codice fiscale',
            deathDate: 'Data decesso',
            deathPlace: 'Luogo decesso'
          },
          notes: 'Note pratica',
          generatedAt: 'Data generazione',
          disclaimer:
            'Generato in modo sicuro tramite Lugubrious Hub.',
          signature: "Firma Ufficiale dell'Operatore"
        }
      : {
          title: 'CIVIL REGISTRY DEATH COMMUNICATION',
          subtitle: 'Digital Registry Certificate',
          sectionData: 'PERSONAL DATA',
          protocol: 'PROTOCOL: LH-2026/02',
          labels: {
            name: 'Full name',
            taxId: 'Tax code',
            deathDate: 'Date of death',
            deathPlace: 'Place of death'
          },
          notes: 'Case notes',
          generatedAt: 'Generated on',
          disclaimer:
            'Generated securely through Lugubrious Hub.',
          signature: 'Official Operator Signature'
        };

  return (
    <section>
      <h2 className="text-4xl font-semibold">{t.title}</h2>
      <p className="mt-2 text-slate-300">{t.subtitle}</p>

      <div className="surface-soft mt-6 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.name}
            <input
              value={formData.name}
              onChange={handleFieldChange('name')}
              placeholder={t.placeholders.name}
              className="field"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.taxId}
            <input
              value={formData.taxId}
              onChange={handleFieldChange('taxId')}
              placeholder={t.placeholders.taxId}
              className="field"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.deathDate}
            <input
              value={formData.deathDate}
              onChange={handleFieldChange('deathDate')}
              type="date"
              className="field"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.deathPlace}
            <input
              value={formData.deathPlace}
              onChange={handleFieldChange('deathPlace')}
              placeholder={t.placeholders.deathPlace}
              className="field"
            />
          </label>
          <label className="grid gap-1 text-sm text-slate-200 md:col-span-2">
            {t.fields.notes}
            <textarea
              value={formData.notes}
              onChange={handleFieldChange('notes')}
              rows={4}
              placeholder={t.placeholders.notes}
              className="field"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className={`btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${
              isGenerating ? 'animate-pulse' : ''
            }`}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isGenerating
              ? language === 'it'
                ? 'Autenticazione e Generazione in corso...'
                : 'Authenticating and Generating...'
              : t.actions.generateIdle}
          </button>
          <ActionButton
            status={saveStatus}
            idleLabel={t.actions.saveIdle}
            loadingLabel={t.actions.saveLoading}
            successLabel={t.actions.saveSuccess}
            onClick={() => runMockAction(setSaveStatus)}
            variant="secondary"
          />
        </div>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.18)]">
          {toastMessage}
        </div>
      ) : null}

      <div className="absolute -left-[9999px] top-0">
        <div
          ref={pdfTemplateRef}
          className="relative w-[210mm] min-h-[297mm] overflow-hidden bg-white p-12 text-black"
        >
          <p className="pointer-events-none absolute left-1/2 top-1/2 select-none font-serif text-[200px] text-gray-100 opacity-40 [transform:translate(-50%,-50%)_rotate(-45deg)]">
            LH
          </p>

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6 border-b-2 border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  <defs>
                    <linearGradient id="lhGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="29" fill="none" stroke="url(#lhGradient)" strokeWidth="4" />
                  <text
                    x="32"
                    y="40"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontWeight="700"
                    fontSize="22"
                    fill="url(#lhGradient)"
                  >
                    LH
                  </text>
                </svg>
                <div>
                  <p className="font-serif text-2xl font-extrabold tracking-[0.3em] text-black">LUGUBRIOUS HUB</p>
                  <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-gray-600">{pdfText.sectionData}</p>
                </div>
              </div>
              <div className="rounded-md bg-gray-900 px-4 py-2 text-right">
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white">{pdfText.protocol}</p>
              </div>
            </div>

            <div className="mt-8 border-l-8 border-purple-600 bg-gray-50 p-6">
              <h3 className="font-serif text-2xl font-extrabold uppercase tracking-wide text-black">{pdfText.title}</h3>
              <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gray-700">{pdfText.subtitle}</p>
            </div>

            <div className="mt-10 divide-y-2 divide-gray-200 border-y-2 border-gray-200">
              <div className="flex">
                <div className="w-1/3 pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pdfText.labels.name}
                </div>
                <div className="w-2/3 pt-1 pb-4 font-serif text-xl font-bold text-black">{formData.name || '-'}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pdfText.labels.taxId}
                </div>
                <div className="w-2/3 pt-1 pb-4 font-serif text-xl font-bold text-black">{formData.taxId || '-'}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pdfText.labels.deathDate}
                </div>
                <div className="w-2/3 pt-1 pb-4 font-serif text-xl font-bold text-black">{formData.deathDate || '-'}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pdfText.labels.deathPlace}
                </div>
                <div className="w-2/3 pt-1 pb-4 font-serif text-xl font-bold text-black">{formData.deathPlace || '-'}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 pt-4 pb-1 font-sans text-xs font-bold uppercase tracking-widest text-gray-500">
                  {pdfText.notes}
                </div>
                <div className="w-2/3 pt-1 pb-4 font-serif text-lg font-bold text-gray-900 whitespace-pre-wrap">
                  {formData.notes || '-'}
                </div>
              </div>
            </div>

            <div className="mt-14 border-t-2 border-gray-200 pt-5">
              <p className="font-sans text-sm font-semibold text-gray-900">
                {pdfText.disclaimer}
                <span className="ml-2 text-gray-700">
                  {pdfText.generatedAt}: {generatedAt}
                </span>
              </p>
              <div className="mt-12 max-w-sm">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500">{pdfText.signature}</p>
                <div className="mt-3 h-px w-full bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
