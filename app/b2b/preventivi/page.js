'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  FileText,
  Mail,
  Megaphone,
  MessageCircle,
  Truck
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../../components/LanguageProvider';

const fakeLink = 'https://pay.lugubrious.hub/req-8472';

const copyByLanguage = {
  it: {
    title: 'Quoting Engine e Split Payment',
    subtitle: 'Configura un preventivo professionale completo con struttura fiscale e quota familiare dinamica.',
    cards: {
      bureaucracy: 'Burocrazia e Diritti (Esenti IVA Art. 15)',
      preparation: 'Preparazione e Cofano (Salma e Bara)',
      logistics: 'Logistica e Cerimonia',
      communication: 'Comunicazione e Extra'
    },
    fields: {
      practices: 'Pratiche Agenzia',
      taxes: 'Tasse Comunali e Cimiteriali',
      cremation: 'Cremazione (se applicabile)',
      treatment: 'Trattamento Salma',
      coffin: 'Feretro (Bara)',
      zinc: 'Aggiungi vasca in zinco e valvola (€300)',
      hearse: 'Auto Funebre',
      staff: 'Personale (Necrofori)',
      setup: 'Allestimento Camera Ardente',
      flowers: 'Composizioni Floreali',
      epigraphs: 'Epigrafi (Manifesti)',
      newspaper: 'Aggiungi Necrologio Quotidiano Locale (€200)',
      familyCount: 'Numero familiari per Split Payment'
    },
    summary: {
      title: 'Riepilogo Dinamico e Split Payment',
      agencyTaxable: 'Imponibile Agenzia',
      advances: 'Anticipazioni (Tasse)',
      total: 'Totale Preventivo',
      split: 'Quota per familiare',
      generate: 'Genera Link di Pagamento Condiviso',
      generating: 'Generazione link in corso...',
      invalidFamily: 'Inserisci almeno 1 familiare per il calcolo split.',
      copied: 'Link generato e copiato negli appunti:',
      manual: 'Link generato (copia manuale):',
      splitCardsTitle: 'Quote Familiari',
      splitPending: 'In attesa di pagamento',
      splitSent: 'Inviato'
    },
    options: {
      practices: [
        { value: 'base', label: 'Base', price: 250 },
        { value: 'complete', label: 'Complete con successione', price: 600 }
      ],
      cremation: [
        { value: 'none', label: 'Nessuna', price: 0 },
        { value: 'local', label: 'Polo Crematorio Locale', price: 650 }
      ],
      treatment: [
        { value: 'basic', label: 'Igiene e Vestizione base', price: 150 },
        { value: 'advanced', label: 'Tanatoestetica avanzata', price: 350 }
      ],
      coffin: [
        { value: 'spruce', label: 'Abete standard', price: 600 },
        { value: 'oak', label: 'Rovere/Noce medio', price: 1200 },
        { value: 'mahogany', label: 'Mogano lavorato a mano', price: 2500 }
      ],
      hearse: [
        { value: 'mercedes', label: 'Mercedes Standard', price: 350 },
        { value: 'maserati', label: 'Maserati/Limousine', price: 600 }
      ],
      staff: [
        { value: '2', label: '2 Portatori', price: 200 },
        { value: '4', label: '4 Portatori', price: 400 }
      ],
      setup: [
        { value: 'base', label: 'Base (Paraventi e candelabri)', price: 150 },
        { value: 'premium', label: 'Premium (Tappeti, luci LED, fondale)', price: 400 }
      ],
      flowers: [
        { value: 'simple', label: 'Copribara semplice', price: 150 },
        { value: 'full', label: 'Cuscino e 2 Corone', price: 450 }
      ],
      epigraphs: [
        { value: '50', label: '50 manifesti stampati e affissi', price: 150 },
        { value: '100', label: '100 manifesti', price: 250 }
      ]
    }
  },
  en: {
    title: 'Quoting Engine and Split Payment',
    subtitle: 'Build a complete professional quote with fiscal structure and dynamic family split.',
    cards: {
      bureaucracy: 'Paperwork and Rights (VAT-exempt Art. 15)',
      preparation: 'Preparation and Coffin (Body and Casket)',
      logistics: 'Logistics and Ceremony',
      communication: 'Communication and Extras'
    },
    fields: {
      practices: 'Agency Paperwork',
      taxes: 'Municipal and Cemetery Taxes',
      cremation: 'Cremation (if applicable)',
      treatment: 'Body Preparation',
      coffin: 'Coffin (Casket)',
      zinc: 'Add zinc inner liner and valve (€300)',
      hearse: 'Hearse',
      staff: 'Staff (Bearers)',
      setup: 'Viewing Room Setup',
      flowers: 'Floral Compositions',
      epigraphs: 'Posters (Epigraphs)',
      newspaper: 'Add Local Newspaper Obituary (€200)',
      familyCount: 'Number of relatives for Split Payment'
    },
    summary: {
      title: 'Dynamic Summary and Split Payment',
      agencyTaxable: 'Agency Taxable Amount',
      advances: 'Advances (Taxes)',
      total: 'Total Quote',
      split: 'Share per relative',
      generate: 'Generate Shared Payment Link',
      generating: 'Generating payment link...',
      invalidFamily: 'Enter at least 1 relative for split calculation.',
      copied: 'Link generated and copied to clipboard:',
      manual: 'Link generated (copy manually):',
      splitCardsTitle: 'Family Shares',
      splitPending: 'Waiting for payment',
      splitSent: 'Sent'
    },
    options: {
      practices: [
        { value: 'base', label: 'Base', price: 250 },
        { value: 'complete', label: 'Complete with succession', price: 600 }
      ],
      cremation: [
        { value: 'none', label: 'None', price: 0 },
        { value: 'local', label: 'Local Crematory Hub', price: 650 }
      ],
      treatment: [
        { value: 'basic', label: 'Basic cleaning and dressing', price: 150 },
        { value: 'advanced', label: 'Advanced thanato-aesthetics', price: 350 }
      ],
      coffin: [
        { value: 'spruce', label: 'Standard spruce', price: 600 },
        { value: 'oak', label: 'Medium oak/walnut', price: 1200 },
        { value: 'mahogany', label: 'Handcrafted mahogany', price: 2500 }
      ],
      hearse: [
        { value: 'mercedes', label: 'Mercedes Standard', price: 350 },
        { value: 'maserati', label: 'Maserati/Limousine', price: 600 }
      ],
      staff: [
        { value: '2', label: '2 Bearers', price: 200 },
        { value: '4', label: '4 Bearers', price: 400 }
      ],
      setup: [
        { value: 'base', label: 'Base (Screens and candelabra)', price: 150 },
        { value: 'premium', label: 'Premium (Rugs, LED lights, backdrop)', price: 400 }
      ],
      flowers: [
        { value: 'simple', label: 'Simple coffin cover', price: 150 },
        { value: 'full', label: 'Cushion and 2 wreaths', price: 450 }
      ],
      epigraphs: [
        { value: '50', label: '50 printed and posted notices', price: 150 },
        { value: '100', label: '100 notices', price: 250 }
      ]
    }
  }
};

function findPrice(options, value) {
  return options.find((item) => item.value === value)?.price ?? 0;
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm text-slate-200">
      {label}
      {children}
    </label>
  );
}

function GlassSelect(props) {
  return (
    <select
      {...props}
      className="appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
    />
  );
}

function GlassInput(props) {
  return (
    <input
      {...props}
      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/30"
    />
  );
}

function AccordionSection({ icon: Icon, title, subtotal, open, onToggle, children, formatMoney }) {
  return (
    <article className="rounded-xl border border-white/5 bg-white/[0.02]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
            <Icon className="h-4 w-4 text-sky-300" />
          </span>
          <p className="font-serif text-lg text-white">{title}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">{formatMoney(subtotal)}</span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 border-t border-white/5 px-4 py-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export default function PreventiviPage() {
  const { language } = useLanguage();
  const ui = copyByLanguage[language] ?? copyByLanguage.it;
  const locale = language === 'it' ? 'it-IT' : 'en-IE';

  const [openSection, setOpenSection] = useState('bureaucracy');

  const [practices, setPractices] = useState('base');
  const [municipalTaxes, setMunicipalTaxes] = useState(150);
  const [cremation, setCremation] = useState('none');

  const [treatment, setTreatment] = useState('basic');
  const [coffin, setCoffin] = useState('spruce');
  const [zinc, setZinc] = useState(false);

  const [hearse, setHearse] = useState('mercedes');
  const [staff, setStaff] = useState('2');
  const [setup, setSetup] = useState('base');
  const [flowers, setFlowers] = useState('simple');

  const [epigraphs, setEpigraphs] = useState('50');
  const [newspaperObituary, setNewspaperObituary] = useState(false);

  const [familyCount, setFamilyCount] = useState(3);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [sentState, setSentState] = useState({});

  const formatMoney = (value) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);

  const pricing = useMemo(() => {
    const practicesPrice = findPrice(ui.options.practices, practices);
    const cremationPrice = findPrice(ui.options.cremation, cremation);
    const treatmentPrice = findPrice(ui.options.treatment, treatment);
    const coffinPrice = findPrice(ui.options.coffin, coffin);
    const zincPrice = zinc ? 300 : 0;
    const hearsePrice = findPrice(ui.options.hearse, hearse);
    const staffPrice = findPrice(ui.options.staff, staff);
    const setupPrice = findPrice(ui.options.setup, setup);
    const flowersPrice = findPrice(ui.options.flowers, flowers);
    const epigraphsPrice = findPrice(ui.options.epigraphs, epigraphs);
    const newspaperPrice = newspaperObituary ? 200 : 0;
    const taxValue = Number(municipalTaxes) || 0;

    const bureaucracySubtotal = practicesPrice + cremationPrice + taxValue;
    const preparationSubtotal = treatmentPrice + coffinPrice + zincPrice;
    const logisticsSubtotal = hearsePrice + staffPrice + setupPrice + flowersPrice;
    const communicationSubtotal = epigraphsPrice + newspaperPrice;

    const agencyTaxable =
      practicesPrice + treatmentPrice + coffinPrice + zincPrice + hearsePrice + staffPrice + setupPrice + flowersPrice + epigraphsPrice + newspaperPrice;

    const advances = taxValue + cremationPrice;

    return {
      subtotals: {
        bureaucracy: bureaucracySubtotal,
        preparation: preparationSubtotal,
        logistics: logisticsSubtotal,
        communication: communicationSubtotal
      },
      agencyTaxable,
      advances,
      total: agencyTaxable + advances
    };
  }, [
    ui,
    practices,
    municipalTaxes,
    cremation,
    treatment,
    coffin,
    zinc,
    hearse,
    staff,
    setup,
    flowers,
    epigraphs,
    newspaperObituary
  ]);

  const safeFamilyCount = Math.max(1, Number(familyCount) || 1);
  const splitQuota = pricing.total / safeFamilyCount;

  const handleGenerateLink = () => {
    if (!familyCount || Number(familyCount) < 1) {
      setStatus('error');
      setMessage(ui.summary.invalidFamily);
      setIsGenerated(false);
      return;
    }

    setStatus('loading');
    setMessage('');
    setIsGenerated(false);

    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(fakeLink);
        setStatus('success');
        setMessage(`${ui.summary.copied} ${fakeLink}`);
      } catch {
        setStatus('success');
        setMessage(`${ui.summary.manual} ${fakeLink}`);
      }
      setIsGenerated(true);
      setSentState({});
    }, 1000);
  };

  const markSent = (quotaIndex, channel) => {
    const key = `${quotaIndex}-${channel}`;
    setSentState((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSentState((prev) => ({ ...prev, [key]: false }));
    }, 1200);
  };

  return (
    <section>
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-slate-300" />
        <h2 className="text-4xl font-semibold text-white">{ui.title}</h2>
      </div>
      <p className="mt-2 text-slate-300">{ui.subtitle}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-3 lg:max-h-[74vh] lg:overflow-y-auto lg:pr-1">
          <AccordionSection
            icon={FileText}
            title={ui.cards.bureaucracy}
            subtotal={pricing.subtotals.bureaucracy}
            formatMoney={formatMoney}
            open={openSection === 'bureaucracy'}
            onToggle={() => setOpenSection((prev) => (prev === 'bureaucracy' ? '' : 'bureaucracy'))}
          >
            <Field label={ui.fields.practices}>
              <GlassSelect value={practices} onChange={(e) => setPractices(e.target.value)}>
                {ui.options.practices.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <Field label={ui.fields.taxes}>
              <GlassInput
                type="number"
                min={0}
                value={municipalTaxes}
                onChange={(e) => setMunicipalTaxes(e.target.value)}
              />
            </Field>

            <Field label={ui.fields.cremation}>
              <GlassSelect value={cremation} onChange={(e) => setCremation(e.target.value)}>
                {ui.options.cremation.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>
          </AccordionSection>

          <AccordionSection
            icon={Building2}
            title={ui.cards.preparation}
            subtotal={pricing.subtotals.preparation}
            formatMoney={formatMoney}
            open={openSection === 'preparation'}
            onToggle={() => setOpenSection((prev) => (prev === 'preparation' ? '' : 'preparation'))}
          >
            <Field label={ui.fields.treatment}>
              <GlassSelect value={treatment} onChange={(e) => setTreatment(e.target.value)}>
                {ui.options.treatment.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <Field label={ui.fields.coffin}>
              <GlassSelect value={coffin} onChange={(e) => setCoffin(e.target.value)}>
                {ui.options.coffin.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-200">
              <input type="checkbox" checked={zinc} onChange={(e) => setZinc(e.target.checked)} className="h-4 w-4 accent-sky-500" />
              {ui.fields.zinc}
            </label>
          </AccordionSection>

          <AccordionSection
            icon={Truck}
            title={ui.cards.logistics}
            subtotal={pricing.subtotals.logistics}
            formatMoney={formatMoney}
            open={openSection === 'logistics'}
            onToggle={() => setOpenSection((prev) => (prev === 'logistics' ? '' : 'logistics'))}
          >
            <Field label={ui.fields.hearse}>
              <GlassSelect value={hearse} onChange={(e) => setHearse(e.target.value)}>
                {ui.options.hearse.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <Field label={ui.fields.staff}>
              <GlassSelect value={staff} onChange={(e) => setStaff(e.target.value)}>
                {ui.options.staff.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <Field label={ui.fields.setup}>
              <GlassSelect value={setup} onChange={(e) => setSetup(e.target.value)}>
                {ui.options.setup.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <Field label={ui.fields.flowers}>
              <GlassSelect value={flowers} onChange={(e) => setFlowers(e.target.value)}>
                {ui.options.flowers.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>
          </AccordionSection>

          <AccordionSection
            icon={Megaphone}
            title={ui.cards.communication}
            subtotal={pricing.subtotals.communication}
            formatMoney={formatMoney}
            open={openSection === 'communication'}
            onToggle={() => setOpenSection((prev) => (prev === 'communication' ? '' : 'communication'))}
          >
            <Field label={ui.fields.epigraphs}>
              <GlassSelect value={epigraphs} onChange={(e) => setEpigraphs(e.target.value)}>
                {ui.options.epigraphs.map((item) => (
                  <option key={item.value} value={item.value}>{`${item.label} (${formatMoney(item.price)})`}</option>
                ))}
              </GlassSelect>
            </Field>

            <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={newspaperObituary}
                onChange={(e) => setNewspaperObituary(e.target.checked)}
                className="h-4 w-4 accent-sky-500"
              />
              {ui.fields.newspaper}
            </label>
          </AccordionSection>

          <AnimatePresence>
            {isGenerated ? (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-8 border-t border-white/10 pt-8"
              >
                <h3 className="mb-4 font-serif text-xl text-white">
                  {language === 'it' ? 'Quote Familiari Generate' : 'Generated Family Shares'}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: safeFamilyCount }).map((_, index) => {
                    const waKey = `${index}-wa`;
                    const mailKey = `${index}-mail`;
                    const sent = sentState[waKey] || sentState[mailKey];

                    return (
                      <article
                        key={`share-grid-${index}`}
                        className="flex flex-col rounded-xl border border-white/10 bg-[#0B0F19]/90 p-4 shadow-lg transition-all hover:border-purple-500/30"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white/80">{`Quota ${index + 1}`}</p>
                          <p className="text-xs text-yellow-500/80">{ui.summary.splitPending}</p>
                        </div>

                        <p className="my-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-center text-2xl font-bold text-transparent">
                          {formatMoney(splitQuota)}
                        </p>

                        <div className="mt-auto flex w-full items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => markSent(index, 'wa')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-white/70 transition-all hover:border-green-500/50 hover:bg-green-500/20 hover:text-green-400"
                          >
                            <span className="flex justify-center">
                              <MessageCircle className="h-4 w-4" />
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => markSent(index, 'mail')}
                            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-white/70 transition-all hover:border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-400"
                          >
                            <span className="flex justify-center">
                              <Mail className="h-4 w-4" />
                            </span>
                          </button>
                        </div>

                        <p className="mt-2 min-h-4 text-center text-xs text-emerald-300">
                          {sent ? ui.summary.splitSent : ''}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </div>

        <aside className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:sticky lg:top-24 lg:h-fit">
          <h3 className="font-serif text-2xl text-white">{ui.summary.title}</h3>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-slate-300">
              <span>{ui.summary.agencyTaxable}</span>
              <strong className="text-white">{formatMoney(pricing.agencyTaxable)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-slate-300">
              <span>{ui.summary.advances}</span>
              <strong className="text-white">{formatMoney(pricing.advances)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-sky-300/30 bg-sky-500/[0.08] px-3 py-2 text-slate-100">
              <span>{ui.summary.total}</span>
              <strong className="text-white">{formatMoney(pricing.total)}</strong>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <Field label={ui.fields.familyCount}>
              <GlassInput
                type="number"
                min={1}
                value={familyCount}
                onChange={(e) => setFamilyCount(e.target.value)}
              />
            </Field>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
              <span>{ui.summary.split}</span>
              <strong className="text-white">{formatMoney(splitQuota)}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateLink}
            disabled={status === 'loading'}
            className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? ui.summary.generating : ui.summary.generate}
          </button>

          {message ? (
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                status === 'error'
                  ? 'border-rose-300/50 bg-rose-500/10 text-rose-200'
                  : 'border-emerald-300/50 bg-emerald-500/10 text-emerald-200'
              }`}
            >
              {message}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
