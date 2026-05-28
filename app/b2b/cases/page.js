'use client';

import { useState } from 'react';
import { FolderOpen, Plus } from 'lucide-react';
import { useLanguage } from '../../../components/LanguageProvider';
import { useDashboard } from '../../context/DashboardContext';
import { copy } from '../../lib/translations';
import NewCaseDrawer from '../../../components/b2b/cases/NewCaseDrawer';

const statusBadge = {
  open: 'border-sky-300/40 bg-sky-500/10 text-sky-200',
  inProgress: 'border-amber-300/40 bg-amber-500/10 text-amber-200',
  completed: 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200'
};

export default function CasesPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bCases;
  const locale = language === 'it' ? 'it-IT' : 'en-IE';
  const { data } = useDashboard();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const formatMoney = (value) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

  const cases = data.cases;

  const openCreate = () => {
    setSelectedCase(null);
    setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setSelectedCase(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedCase(null);
  };

  return (
    <>
      <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-slate-300" />
            <h2 className="text-4xl font-semibold text-white">{t.title}</h2>
          </div>
          <p className="mt-2 text-slate-300">{t.subtitle}</p>
        </div>

        <button type="button" onClick={openCreate} className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          {t.newCase}
        </button>
      </div>

      {cases.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-400">
          {t.empty}
        </div>
      ) : (
        <div className="surface mt-6 overflow-x-auto p-1">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-medium">{t.columns.id}</th>
                <th className="px-4 py-3 font-medium">{t.columns.family}</th>
                <th className="px-4 py-3 font-medium">{t.columns.service}</th>
                <th className="px-4 py-3 font-medium">{t.columns.amount}</th>
                <th className="px-4 py-3 font-medium">{t.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openEdit(item)}
                  className="cursor-pointer border-t border-white/10 transition-colors hover:bg-white/[0.05]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-white">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{item.deceasedName}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{t.drawer.riteOptions[item.riteType] ?? item.riteType}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{formatMoney(item.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                        statusBadge[item.status] ?? statusBadge.open
                      }`}
                    >
                      {t.statuses[item.status] ?? item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </section>

      {/* Fuori da ogni .surface / relative / overflow-hidden: il drawer è renderizzato via portal su <body>. */}
      <NewCaseDrawer open={drawerOpen} onClose={closeDrawer} selectedCase={selectedCase} />
    </>
  );
}
