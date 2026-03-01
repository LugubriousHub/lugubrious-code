'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

function Icon({ path, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const catalog = {
  ORD112: {
    category: { it: 'Fiori', en: 'Flowers' },
    partner: 'Petali Aurora',
    service: { it: 'Corona premium', en: 'Premium wreath' }
  },
  ORD113: {
    category: { it: 'Marmo', en: 'Marble' },
    partner: 'Lapidi Bernini',
    service: { it: 'Incisione targa', en: 'Plaque engraving' }
  },
  ORD114: {
    category: { it: 'Crematorio', en: 'Crematorium' },
    partner: 'Centro Nord 3',
    service: { it: 'Prenotazione slot 11:20', en: '11:20 slot booking' }
  }
};

const initialOrders = [
  { id: 'ORD-112', code: 'ORD112', status: 'pending' },
  { id: 'ORD-113', code: 'ORD113', status: 'pending' },
  { id: 'ORD-114', code: 'ORD114', status: 'confirmed' }
];

export default function FornitoriPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bFornitori;

  const [orders, setOrders] = useState(initialOrders);
  const [banner, setBanner] = useState('');

  const displayOrders = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      category: catalog[order.code].category[language],
      partner: catalog[order.code].partner,
      service: catalog[order.code].service[language]
    }));
  }, [orders, language]);

  const setConfirmed = (id) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status: 'confirmed' } : order))
    );
  };

  const sendReminder = (id) => {
    setBanner(`${t.reminderBanner} ${id}.`);
    setTimeout(() => setBanner(''), 1800);
  };

  return (
    <section>
      <div className="flex items-center gap-3">
        <Icon path="M4 7h16M4 12h16M4 17h16" className="h-6 w-6 text-slate-300" />
        <h2 className="text-4xl font-semibold">{t.title}</h2>
      </div>
      <p className="mt-2 text-slate-300">{t.subtitle}</p>

      {banner ? (
        <p className="mt-4 rounded-lg border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {banner}
        </p>
      ) : null}

      <div className="surface-soft mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.06] text-slate-300">
            <tr>
              <th className="px-4 py-3">{t.columns.order}</th>
              <th className="px-4 py-3">{t.columns.category}</th>
              <th className="px-4 py-3">{t.columns.partner}</th>
              <th className="px-4 py-3">{t.columns.service}</th>
              <th className="px-4 py-3">{t.columns.status}</th>
              <th className="px-4 py-3">{t.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => (
              <tr key={order.id} className="border-t border-white/10 bg-white/[0.03]">
                <td className="px-4 py-3 font-semibold text-white">{order.id}</td>
                <td className="px-4 py-3 text-slate-300">{order.category}</td>
                <td className="px-4 py-3 text-slate-300">{order.partner}</td>
                <td className="px-4 py-3 text-slate-300">{order.service}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      order.status === 'confirmed'
                        ? 'border border-emerald-300/50 bg-emerald-500/10 text-emerald-200'
                        : 'border border-amber-300/50 bg-amber-500/10 text-amber-200'
                    }`}
                  >
                    {order.status === 'confirmed' ? t.confirmed : t.pending}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => sendReminder(order.id)}
                      className="rounded-lg border border-white/20 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/[0.1]"
                    >
                      {t.remind}
                    </button>
                    <button
                      onClick={() => setConfirmed(order.id)}
                      className="rounded-lg border border-emerald-300/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20"
                    >
                      {t.markConfirmed}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
