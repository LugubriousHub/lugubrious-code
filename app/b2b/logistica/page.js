'use client';

import { useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

const initialShift = {
  vehicle: 'Carro 1',
  driver: 'Mario Bianchi',
  time: '09:00'
};

function Icon({ path, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LogisticaPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bLogistica;

  const [form, setForm] = useState(initialShift);
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.vehicle || !form.driver || !form.time) {
      setError(t.error);
      return;
    }

    setError('');
    setShifts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...form
      }
    ]);
  };

  const removeShift = (id) => {
    setShifts((prev) => prev.filter((shift) => shift.id !== id));
  };

  const vehicles = t.vehicles;
  const drivers = t.drivers;

  return (
    <section>
      <div className="flex items-center gap-3">
        <Icon path="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" className="h-6 w-6 text-slate-300" />
        <h2 className="text-4xl font-semibold">{t.title}</h2>
      </div>
      <p className="mt-2 text-slate-300">{t.subtitle}</p>

      <div className="surface-soft mt-6 p-5">
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.vehicle}
            <select
              className="field"
              value={form.vehicle}
              onChange={(e) => setForm((prev) => ({ ...prev, vehicle: e.target.value }))}
            >
              {vehicles.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.driver}
            <select
              className="field"
              value={form.driver}
              onChange={(e) => setForm((prev) => ({ ...prev, driver: e.target.value }))}
            >
              {drivers.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm text-slate-200">
            {t.fields.time}
            <input
              type="time"
              className="field"
              value={form.time}
              onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
            />
          </label>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">
              {t.save}
            </button>
          </div>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
      </div>

      <div className="surface-soft mt-4 p-5">
        <h3 className="text-2xl font-semibold">{t.assigned}</h3>
        {shifts.length === 0 ? <p className="mt-2 text-sm text-slate-400">{t.empty}</p> : null}

        <ul className="mt-3 grid gap-3">
          {shifts.map((shift) => (
            <li
              key={shift.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="text-sm text-slate-200">
                <strong>{shift.vehicle}</strong> - {shift.driver} {t.at} {shift.time}
              </div>
              <button
                onClick={() => removeShift(shift.id)}
                className="rounded-lg border border-rose-300/50 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
              >
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
