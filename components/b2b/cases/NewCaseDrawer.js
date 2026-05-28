'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../../LanguageProvider';
import { useDashboard } from '../../../app/context/DashboardContext';
import { copy } from '../../../app/lib/translations';

const EMPTY_FORM = {
  deceasedName: '',
  deathPlace: '',
  deathDate: '',
  requesterName: '',
  requesterPhone: '',
  kinship: '',
  riteType: 'cremation',
  funeralDate: '',
  amount: '',
  status: 'open'
};

export default function NewCaseDrawer({ open, onClose, selectedCase }) {
  const { language } = useLanguage();
  const cases = copy[language].b2bCases;
  const t = cases.drawer;
  const { addCase, updateCase } = useDashboard();

  const isEdit = Boolean(selectedCase);
  const [form, setForm] = useState(EMPTY_FORM);

  // Portal su <body>: evita che backdrop-filter/transform di un antenato (.surface del layout)
  // diventi il containing block del fixed, lasciando il drawer "incastrato" nel viewport.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pre-compila i campi in modalità Edit; svuota in modalità Create.
  useEffect(() => {
    if (selectedCase) {
      setForm({
        deceasedName: selectedCase.deceasedName ?? '',
        deathPlace: selectedCase.deathPlace ?? '',
        deathDate: selectedCase.deathDate ?? '',
        requesterName: selectedCase.requesterName ?? '',
        requesterPhone: selectedCase.requesterPhone ?? '',
        kinship: selectedCase.kinship ?? '',
        riteType: selectedCase.riteType ?? 'cremation',
        funeralDate: selectedCase.funeralDate ?? '',
        amount: selectedCase.amount != null ? String(selectedCase.amount) : '',
        status: selectedCase.status ?? 'open'
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [selectedCase, open]);

  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.deceasedName.trim() || !String(form.amount).trim()) return;

    const payload = {
      deceasedName: form.deceasedName.trim(),
      deathPlace: form.deathPlace.trim(),
      deathDate: form.deathDate,
      requesterName: form.requesterName.trim(),
      requesterPhone: form.requesterPhone.trim(),
      kinship: form.kinship.trim(),
      riteType: form.riteType,
      funeralDate: form.funeralDate,
      amount: Number(form.amount),
      status: form.status
    };

    if (isEdit) {
      updateCase(selectedCase.id, payload);
    } else {
      addCase(payload);
    }
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* OVERLAY NERO */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* PANNELLO LATERALE */}
      <div
        className={`fixed top-0 right-0 h-full w-[500px] max-w-full bg-[#0a0f18] border-l border-white/10 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h3 className="text-xl font-semibold text-white">{isEdit ? t.editTitle : t.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            aria-label={t.cancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex h-[calc(100%-73px)] flex-col">
          <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-6">
            {/* Anagrafica Defunto */}
            <fieldset className="grid gap-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-sky-300">{t.sections.deceased}</legend>
              <label className="grid gap-1.5 text-sm text-slate-200">
                {t.fields.deceasedName}
                <input className="field" value={form.deceasedName} onChange={setField('deceasedName')} placeholder={t.placeholders.deceasedName} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.deathPlace}
                  <input className="field" value={form.deathPlace} onChange={setField('deathPlace')} placeholder={t.placeholders.deathPlace} />
                </label>
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.deathDate}
                  <input className="field" type="date" value={form.deathDate} onChange={setField('deathDate')} />
                </label>
              </div>
            </fieldset>

            {/* Richiedente */}
            <fieldset className="grid gap-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-sky-300">{t.sections.requester}</legend>
              <label className="grid gap-1.5 text-sm text-slate-200">
                {t.fields.requesterName}
                <input className="field" value={form.requesterName} onChange={setField('requesterName')} placeholder={t.placeholders.requesterName} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.requesterPhone}
                  <input className="field" value={form.requesterPhone} onChange={setField('requesterPhone')} placeholder={t.placeholders.requesterPhone} />
                </label>
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.kinship}
                  <input className="field" value={form.kinship} onChange={setField('kinship')} placeholder={t.placeholders.kinship} />
                </label>
              </div>
            </fieldset>

            {/* Esequie */}
            <fieldset className="grid gap-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-sky-300">{t.sections.funeral}</legend>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.riteType}
                  <select className="field" value={form.riteType} onChange={setField('riteType')}>
                    {Object.entries(t.riteOptions).map(([key, label]) => (
                      <option key={key} value={key} className="bg-slate-950 text-slate-100">
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.funeralDate}
                  <input className="field" type="date" value={form.funeralDate} onChange={setField('funeralDate')} />
                </label>
              </div>
            </fieldset>

            {/* Amministrazione */}
            <fieldset className="grid gap-3">
              <legend className="text-xs font-semibold uppercase tracking-wide text-sky-300">{t.sections.admin}</legend>
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.amount}
                  <input className="field" type="number" min={0} value={form.amount} onChange={setField('amount')} placeholder={t.placeholders.amount} />
                </label>
                <label className="grid gap-1.5 text-sm text-slate-200">
                  {t.fields.status}
                  <select className="field" value={form.status} onChange={setField('status')}>
                    {Object.entries(cases.statuses).map(([key, label]) => (
                      <option key={key} value={key} className="bg-slate-950 text-slate-100">
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t.cancel}
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? t.submitEdit : t.submit}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}
