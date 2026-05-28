'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { copy } from '../lib/translations';

const DashboardContext = createContext(null);

const MONTHS_COUNT = 12;
const REVENUE_STAT_ID = 'total_revenue';
const CEREMONIES_STAT_ID = 'monthly_ceremonies';
const STAT_IDS = ['active_cases', 'monthly_ceremonies', 'total_revenue', 'supplier_orders'];

// Garantisce sempre e rigorosamente 12 numeri: evita i crash SVG della dashboard.
function normalizeSeries(series) {
  const source = Array.isArray(series) ? series : [];
  const out = source.slice(0, MONTHS_COUNT).map((n) => {
    const value = Number(n);
    return Number.isFinite(value) ? value : 0;
  });
  while (out.length < MONTHS_COUNT) out.push(0);
  return out;
}

function normalizeMonths(months) {
  const source = Array.isArray(months) ? months : [];
  const out = source.slice(0, MONTHS_COUNT).map((m) => String(m));
  while (out.length < MONTHS_COUNT) out.push(`M${out.length + 1}`);
  return out;
}

function parseRaw(value) {
  const digits = String(value).replace(/[^\d-]/g, '');
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
}

function deltaTrend(delta) {
  const text = typeof delta === 'string' ? delta.trim() : '';
  if (text.startsWith('+')) return 'up';
  if (text.startsWith('-')) return 'down';
  return 'flat';
}

function formatEuro(amount) {
  return `€${new Intl.NumberFormat('it-IT').format(amount)}`;
}

function buildInitialState() {
  const source = copy.it.b2bDashboard;

  const stats = source.stats.map((stat, index) => ({
    id: STAT_IDS[index] ?? `stat_${index}`,
    label: stat.label,
    value: stat.value,
    rawValue: parseRaw(stat.value),
    detail: stat.detail,
    delta: stat.delta,
    trend: deltaTrend(stat.delta)
  }));

  const datasets = { operations: {}, revenue: {} };
  Object.keys(source.datasets).forEach((metric) => {
    Object.keys(source.datasets[metric]).forEach((year) => {
      datasets[metric][year] = normalizeSeries(source.datasets[metric][year]);
    });
  });

  const notifications = source.notifications.map((item, index) => ({
    id: `seed_${index}`,
    title: item.title,
    detail: item.detail
  }));

  // status e riteType come CHIAVI, tradotte in tabella/drawer. Date in ISO 'YYYY-MM-DD'.
  const cases = [
    {
      id: 'P-8472',
      deceasedName: 'Luigi Casadei',
      deathPlace: 'Forlì',
      deathDate: '2026-05-20',
      requesterName: 'Marco Casadei',
      requesterPhone: '+39 333 1234567',
      kinship: 'Figlio',
      riteType: 'entombment',
      funeralDate: '2026-05-24',
      amount: 4200,
      status: 'inProgress'
    },
    {
      id: 'P-8455',
      deceasedName: 'Anna Bernini',
      deathPlace: 'Cesena',
      deathDate: '2026-05-22',
      requesterName: 'Giulia Bernini',
      requesterPhone: '+39 333 7654321',
      kinship: 'Figlia',
      riteType: 'cremation',
      funeralDate: '2026-05-26',
      amount: 2800,
      status: 'open'
    }
  ];

  return {
    stats,
    chart: {
      months: normalizeMonths(source.months),
      datasets,
      availableYears: Object.keys(datasets.revenue)
    },
    notifications,
    cases,
    lastUpdated: new Date().toISOString()
  };
}

function resolveCurrentYear(state) {
  const currentYear = String(new Date().getFullYear());
  const years = state.chart.availableYears;
  if (years.includes(currentYear)) return currentYear;
  return years[years.length - 1];
}

export function DashboardProvider({ children }) {
  const [data, setData] = useState(buildInitialState);

  const updateStat = useCallback((id, patch) => {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) => (stat.id === id ? { ...stat, ...patch } : stat)),
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const addNotification = useCallback(({ title, detail }) => {
    setData((prev) => ({
      ...prev,
      notifications: [
        { id: `n_${Date.now()}`, title, detail },
        ...prev.notifications
      ],
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  const updateChartData = useCallback((metric, year, monthIndex, value) => {
    setData((prev) => {
      const series = normalizeSeries(prev.chart.datasets[metric]?.[year]);
      const nextSeries = normalizeSeries(
        series.map((current, index) => (index === monthIndex ? Number(value) : current))
      );
      return {
        ...prev,
        chart: {
          ...prev.chart,
          datasets: {
            ...prev.chart.datasets,
            [metric]: { ...prev.chart.datasets[metric], [year]: nextSeries }
          }
        },
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // +500€ sul mese corrente: aggiorna serie grafico E card KPI in un unico setData (atomico).
  const simulateRevenueBump = useCallback((amount = 500) => {
    setData((prev) => {
      const year = resolveCurrentYear(prev);
      const monthIndex = new Date().getMonth();
      const series = normalizeSeries(prev.chart.datasets.revenue?.[year]);
      const nextSeries = normalizeSeries(
        series.map((current, index) => (index === monthIndex ? current + amount : current))
      );
      const stats = prev.stats.map((stat) => {
        if (stat.id !== REVENUE_STAT_ID) return stat;
        const rawValue = stat.rawValue + amount;
        return { ...stat, rawValue, value: formatEuro(rawValue) };
      });
      return {
        ...prev,
        stats,
        chart: {
          ...prev.chart,
          datasets: {
            ...prev.chart.datasets,
            revenue: { ...prev.chart.datasets.revenue, [year]: nextSeries }
          }
        },
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Crea una pratica e riflette i dati nella dashboard in un unico setData atomico:
  // serie revenue + KPI fatturato, serie operations + KPI cerimonie (mese corrente), notifica.
  const addCase = useCallback((caseData) => {
    setData((prev) => {
      const amountValue = Number(caseData.amount);
      const bump = Number.isFinite(amountValue) ? amountValue : 0;
      const newCase = {
        ...caseData,
        id: `P-${String(Date.now()).slice(-4)}`,
        amount: bump,
        status: caseData.status || 'open'
      };

      const year = resolveCurrentYear(prev);
      const monthIndex = new Date().getMonth();

      const revenueSeries = normalizeSeries(prev.chart.datasets.revenue?.[year]);
      const nextRevenue = normalizeSeries(
        revenueSeries.map((current, index) => (index === monthIndex ? current + bump : current))
      );
      const operationsSeries = normalizeSeries(prev.chart.datasets.operations?.[year]);
      const nextOperations = normalizeSeries(
        operationsSeries.map((current, index) => (index === monthIndex ? current + 1 : current))
      );

      const stats = prev.stats.map((stat) => {
        if (stat.id === REVENUE_STAT_ID) {
          const rawValue = stat.rawValue + bump;
          return { ...stat, rawValue, value: formatEuro(rawValue) };
        }
        if (stat.id === CEREMONIES_STAT_ID) {
          const rawValue = stat.rawValue + 1;
          return { ...stat, rawValue, value: String(rawValue) };
        }
        return stat;
      });

      return {
        ...prev,
        stats,
        chart: {
          ...prev.chart,
          datasets: {
            ...prev.chart.datasets,
            revenue: { ...prev.chart.datasets.revenue, [year]: nextRevenue },
            operations: { ...prev.chart.datasets.operations, [year]: nextOperations }
          }
        },
        cases: [newCase, ...prev.cases],
        notifications: [
          { id: `n_${Date.now()}`, title: `Nuova pratica ${newCase.id}`, detail: caseData.deceasedName },
          ...prev.notifications
        ],
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Salva le modifiche di una pratica esistente. Se cambia l'importo, riflette il SOLO delta
  // differenziale (nuovo - vecchio) su serie revenue mese corrente + KPI total_revenue, così la
  // dashboard resta coerente senza doppi conteggi. NON tocca operations/monthly_ceremonies
  // (è una modifica di importo, non una nuova pratica).
  const updateCase = useCallback((id, patch) => {
    setData((prev) => {
      const existingCase = prev.cases.find((item) => item.id === id);
      const nextCases = prev.cases.map((item) => (item.id === id ? { ...item, ...patch } : item));

      const amountDelta =
        existingCase && patch.amount !== undefined
          ? Number(patch.amount) - Number(existingCase.amount)
          : 0;

      if (!Number.isFinite(amountDelta) || amountDelta === 0) {
        return {
          ...prev,
          cases: nextCases,
          lastUpdated: new Date().toISOString()
        };
      }

      const year = resolveCurrentYear(prev);
      const monthIndex = new Date().getMonth();
      const revenueSeries = normalizeSeries(prev.chart.datasets.revenue?.[year]);
      const nextRevenue = normalizeSeries(
        revenueSeries.map((current, index) => (index === monthIndex ? current + amountDelta : current))
      );
      const stats = prev.stats.map((stat) => {
        if (stat.id !== REVENUE_STAT_ID) return stat;
        const rawValue = stat.rawValue + amountDelta;
        return { ...stat, rawValue, value: formatEuro(rawValue) };
      });

      return {
        ...prev,
        stats,
        chart: {
          ...prev.chart,
          datasets: {
            ...prev.chart.datasets,
            revenue: { ...prev.chart.datasets.revenue, [year]: nextRevenue }
          }
        },
        cases: nextCases,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const value = useMemo(
    () => ({ data, updateStat, addNotification, updateChartData, simulateRevenueBump, addCase, updateCase }),
    [data, updateStat, addNotification, updateChartData, simulateRevenueBump, addCase, updateCase]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
