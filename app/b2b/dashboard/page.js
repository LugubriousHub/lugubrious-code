'use client';

import { Activity, BellRing } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';
import { copy } from '../../lib/translations';

function buildSmoothPath(points) {
  if (points.length === 0) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const midX = (points[i - 1].x + points[i].x) / 2;
    path += ` C ${midX} ${points[i - 1].y}, ${midX} ${points[i].y}, ${points[i].x} ${points[i].y}`;
  }
  return path;
}

function computeTicks(minValue, maxValue) {
  const steps = 5;
  const range = Math.max(maxValue - minValue, 1);
  const rawStep = range / steps;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep || 1));
  const normalized = rawStep / magnitude;
  const rounded =
    normalized > 5 ? 10 : normalized > 2 ? 5 : normalized > 1 ? 2 : 1;
  const step = rounded * magnitude;
  const bottom = Math.max(0, Math.floor(minValue / step) * step);
  const top = Math.ceil(maxValue / step) * step;
  return Array.from({ length: steps + 1 }, (_, i) => bottom + i * ((top - bottom) / steps));
}

export default function B2BDashboardPage() {
  const { language } = useLanguage();
  const t = copy[language].b2bDashboard;

  const [metric, setMetric] = useState('operations');
  const [year, setYear] = useState('2026');
  const [activeIndex, setActiveIndex] = useState(null);
  const [displaySeries, setDisplaySeries] = useState(() => t.datasets.operations['2026']);

  const previousSeriesRef = useRef(displaySeries);

  const targetSeries = t.datasets[metric][year];

  useEffect(() => {
    const from = previousSeriesRef.current;
    const to = targetSeries;
    const duration = 520;
    let frame;
    let start = null;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = to.map((value, index) => {
        const begin = from[index] ?? value;
        return begin + (value - begin) * eased;
      });
      setDisplaySeries(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousSeriesRef.current = to;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [targetSeries]);

  const dimensions = { width: 900, height: 320, left: 56, right: 24, top: 24, bottom: 42 };

  const chart = useMemo(() => {
    const maxValue = Math.max(...displaySeries, 1);
    const minValue = Math.min(...displaySeries, 0);
    const yMin = metric === 'operations' ? Math.max(0, minValue - 10) : 0;
    const yMaxBase = metric === 'operations' ? maxValue + 10 : maxValue;
    const ticks = computeTicks(yMin, yMaxBase);
    const yMax = ticks[ticks.length - 1] || 1;

    const usableWidth = dimensions.width - dimensions.left - dimensions.right;
    const usableHeight = dimensions.height - dimensions.top - dimensions.bottom;
    const stepX = usableWidth / (displaySeries.length - 1);

    const points = displaySeries.map((value, index) => {
      const x = dimensions.left + index * stepX;
      const y =
        dimensions.top + ((yMax - value) / (yMax - yMin || 1)) * usableHeight;
      return { x, y, value };
    });

    const line = buildSmoothPath(points);
    const area = `${line} L ${points[points.length - 1].x} ${dimensions.height - dimensions.bottom} L ${points[0].x} ${dimensions.height - dimensions.bottom} Z`;

    return { points, line, area, ticks, yMax };
  }, [displaySeries]);

  const formatValue = (value) => {
    if (metric === 'revenue') {
      return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(value);
    }
    return `${Math.round(value)}`;
  };

  const activePoint = activeIndex !== null ? chart.points[activeIndex] : null;

  const gradientId = metric === 'operations' ? 'opsGradient' : 'revGradient';
  const lineColor = metric === 'operations' ? '#60a5fa' : '#34d399';

  useEffect(() => {
    if (metric === 'operations') {
      const summary =
        language === 'it'
          ? `Contesto dashboard: metrica Andamento Operativo, anno ${year}. Valori mensili: ${t.months
              .map((month, i) => `${month} ${Math.round(targetSeries[i])}`)
              .join(', ')}.`
          : `Dashboard context: metric Operations, year ${year}. Monthly values: ${t.months
              .map((month, i) => `${month} ${Math.round(targetSeries[i])}`)
              .join(', ')}.`;
      window.localStorage.setItem('lugubrious-page-context', summary);
    } else {
      const summary =
        language === 'it'
          ? `Contesto dashboard: metrica Fatturato, anno ${year}. Valori mensili in euro: ${t.months
              .map((month, i) => `${month} ${Math.round(targetSeries[i])}`)
              .join(', ')}. Confronta sempre con anno alternativo disponibile.`
          : `Dashboard context: metric Revenue, year ${year}. Monthly values in euro: ${t.months
              .map((month, i) => `${month} ${Math.round(targetSeries[i])}`)
              .join(', ')}. Alternate year comparison is available.`;
      window.localStorage.setItem('lugubrious-page-context', summary);
    }
  }, [language, metric, targetSeries, t.months, year]);

  return (
    <section>
      <h2 className="text-4xl font-semibold">{t.title}</h2>
      <p className="mt-2 text-slate-300">{t.subtitle}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {t.stats.map((card) => (
          <article key={card.label} className="surface-soft border border-white/10 p-3.5">
            <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <p className="text-2xl font-semibold text-white">{card.value}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  card.delta.startsWith('+')
                    ? 'border border-emerald-300/40 bg-emerald-500/10 text-emerald-300'
                    : 'border border-rose-300/40 bg-rose-500/10 text-rose-300'
                }`}
              >
                {card.delta}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
          </article>
        ))}
      </div>

      <section className="surface-soft mt-6 border border-white/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-2xl font-semibold">{t.performanceTitle}</h3>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setMetric('operations')}
              className={`rounded-full px-3 py-1 text-xs ${
                metric === 'operations'
                  ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white'
                  : 'text-slate-300'
              }`}
            >
              {t.tabOperations}
            </button>
            <button
              type="button"
              onClick={() => setMetric('revenue')}
              className={`rounded-full px-3 py-1 text-xs ${
                metric === 'revenue'
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                  : 'text-slate-300'
              }`}
            >
              {t.tabRevenue}
            </button>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <span className="px-2 text-xs text-slate-400">{t.yearSwitcherLabel}</span>
            <button
              type="button"
              onClick={() => setYear('2026')}
              className={`rounded-full px-3 py-1 text-xs ${
                year === '2026' ? 'bg-white/15 text-white' : 'text-slate-300'
              }`}
            >
              {t.year2026}
            </button>
            <button
              type="button"
              onClick={() => setYear('2025')}
              className={`rounded-full px-3 py-1 text-xs ${
                year === '2025' ? 'bg-white/15 text-white' : 'text-slate-300'
              }`}
            >
              {t.year2025}
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-400">{t.trendFilter}</div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/40 p-3">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <div className="relative">
                  <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="h-[320px] w-full">
                    <defs>
                      <linearGradient id="opsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
                      </linearGradient>
                      <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>

                    {chart.ticks.map((tick) => {
                      const y =
                        dimensions.top +
                        ((chart.yMax - tick) / (chart.yMax || 1)) *
                          (dimensions.height - dimensions.top - dimensions.bottom);

                      return (
                        <g key={`tick-${tick}`}>
                          <line
                            x1={dimensions.left}
                            y1={y}
                            x2={dimensions.width - dimensions.right}
                            y2={y}
                            stroke="rgba(255,255,255,0.08)"
                            strokeDasharray="4 6"
                          />
                          <text x={12} y={y + 4} fontSize="12" fill="#94a3b8">
                            {formatValue(tick)}
                          </text>
                        </g>
                      );
                    })}

                    <path d={chart.area} fill={`url(#${gradientId})`} />
                    <path d={chart.line} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" />

                    {chart.points.map((point, index) => (
                      <g key={`point-${index}`}>
                        <circle cx={point.x} cy={point.y} r="3.5" fill={lineColor} />
                        <text
                          x={point.x}
                          y={dimensions.height - 10}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#94a3b8"
                        >
                          {t.months[index]}
                        </text>
                      </g>
                    ))}

                    {activePoint ? (
                      <g>
                        <circle cx={activePoint.x} cy={activePoint.y} r="12" fill={lineColor} opacity="0.22" />
                        <circle cx={activePoint.x} cy={activePoint.y} r="7" fill={lineColor} opacity="0.7" />
                        <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="#ffffff" />
                      </g>
                    ) : null}

                    <text x={dimensions.left} y={16} fontSize="12" fill="#94a3b8">
                      {metric === 'operations' ? t.axisLabelOperations : t.axisLabelRevenue}
                    </text>
                  </svg>

                  <div className="absolute inset-0 grid grid-cols-12">
                    {chart.points.map((point, index) => (
                      <button
                        key={`hit-${index}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        className="h-full w-full"
                        aria-label={`${t.months[index]} ${year}`}
                      />
                    ))}
                  </div>

                  {activePoint ? (
                    <div
                      className="pointer-events-none absolute min-w-[170px] rounded-xl border border-white/20 bg-slate-900/75 px-3 py-2 text-xs shadow-xl backdrop-blur"
                      style={{
                        left: `${(activePoint.x / dimensions.width) * 100}%`,
                        top: `${(activePoint.y / dimensions.height) * 100}%`,
                        transform: 'translate(-20%, -115%)'
                      }}
                    >
                      <p className="text-slate-300">{`${t.months[activeIndex]} ${year}`}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{formatValue(activePoint.value)}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </article>

          <article className="surface-soft border border-white/10 p-5">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-violet-300" />
              <h3 className="text-2xl font-semibold">{t.latestNotifications}</h3>
            </div>

            <div className="mt-4 max-h-[330px] space-y-2 overflow-y-auto pr-1">
              {t.notifications.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-sky-300/40 hover:bg-sky-400/[0.08]"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
              <span className="inline-flex animate-pulse items-center gap-1 text-sky-300">
                <Activity className="h-3.5 w-3.5" /> {t.liveMonitor}
              </span>{' '}
              {t.liveMonitorText}
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
