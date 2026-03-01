'use client';

import Link from 'next/link';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';

const sections = {
  it: [
    {
      title: '1. Ambito del servizio',
      text: 'I presenti Termini disciplinano l utilizzo della piattaforma Lugubrious Hub da parte di agenzie e familiari autorizzati. Il servizio include strumenti operativi, moduli documentali, assistenza comunicativa e funzioni di supporto basate su automazione e intelligenza artificiale.'
    },
    {
      title: '2. Continuità del servizio',
      text: 'Lugubrious Hub adotta misure tecniche per garantire la continuità operativa e la resilienza della piattaforma. Eventuali finestre di manutenzione programmata o interventi urgenti vengono gestiti con priorità di ripristino e comunicazione tempestiva agli utenti coinvolti.'
    },
    {
      title: '3. Limitazione di responsabilità per contenuti generati da IA',
      text: 'Le funzionalità IA forniscono bozze e suggerimenti a supporto del lavoro umano. L utente mantiene la responsabilità editoriale e legale della versione finale dei contenuti pubblicati, inclusi necrologi e comunicazioni esterne. Lugubrious Hub non sostituisce il controllo professionale dell operatore.'
    },
    {
      title: '4. Proprietà intellettuale dei materiali caricati nel Vault',
      text: 'Foto, video, audio e testi caricati nel Legacy Vault restano di proprietà dei titolari legittimi o dei soggetti autorizzati al caricamento. L utente concede a Lugubrious Hub una licenza limitata, non esclusiva e revocabile per l erogazione tecnica del servizio e la visualizzazione ai destinatari autorizzati.'
    },
    {
      title: '5. Obblighi dell utente e uso corretto',
      text: 'L utente si impegna a caricare contenuti leciti, veritieri e rispettosi della dignità personale. È vietato usare la piattaforma per finalità fraudolente, diffamatorie o contrarie alla normativa vigente. In caso di violazioni gravi, l accesso può essere sospeso per tutela del servizio e dei terzi.'
    },
    {
      title: '6. Modifiche contrattuali e assistenza',
      text: 'Lugubrious Hub può aggiornare i presenti Termini per evoluzioni normative o funzionali. Le modifiche rilevanti vengono comunicate con congruo preavviso. Per supporto contrattuale o operativo è disponibile il canale ufficiale di assistenza.'
    }
  ],
  en: [
    {
      title: '1. Scope of service',
      text: 'These Terms govern the use of Lugubrious Hub by authorized agencies and family users. The service includes operational tools, document workflows, communication support, and automation/AI-assisted features.'
    },
    {
      title: '2. Service continuity',
      text: 'Lugubrious Hub implements technical safeguards to ensure operational continuity and platform resilience. Planned maintenance windows and urgent interventions are managed with restoration priority and timely communication to affected users.'
    },
    {
      title: '3. Limitation of liability for AI-generated content',
      text: 'AI features provide drafts and recommendations to support human work. Users remain legally and editorially responsible for final published content, including obituaries and external communications. Lugubrious Hub does not replace professional human review.'
    },
    {
      title: '4. Intellectual property of Vault uploaded materials',
      text: 'Photos, videos, audio and text uploaded to the Legacy Vault remain the property of rightful owners or authorized uploaders. Users grant Lugubrious Hub a limited, non-exclusive and revocable license strictly necessary for technical service delivery and display to authorized recipients.'
    },
    {
      title: '5. User obligations and proper use',
      text: 'Users agree to upload lawful, accurate and respectful content. Using the platform for fraudulent, defamatory, or unlawful purposes is prohibited. In case of serious violations, access may be suspended to protect the service and third parties.'
    },
    {
      title: '6. Contract updates and assistance',
      text: 'Lugubrious Hub may update these Terms for legal or functional evolution. Material changes are communicated with reasonable notice. Official assistance channels are available for contractual and operational support.'
    }
  ]
};

export default function TermsPage() {
  const { language } = useLanguage();
  const content = sections[language];

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-slate-100 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            Lugubrious Hub
          </Link>
          <LanguageSwitch />
        </div>
        <article className="surface p-6 md:p-8">
          <h1 className="text-4xl font-semibold">{language === 'it' ? 'Termini di Servizio' : 'Terms of Service'}</h1>
          <div className="mt-6 space-y-5">
            {content.map((section) => (
              <section key={section.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h2 className="text-base font-semibold text-white">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{section.text}</p>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
