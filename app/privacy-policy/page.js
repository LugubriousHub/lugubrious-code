'use client';

import Link from 'next/link';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLanguage } from '../../components/LanguageProvider';

const sections = {
  it: [
    {
      title: '1. Finalità del trattamento (Dati sensibili e commemorativi)',
      text: 'Lugubrious Hub tratta dati identificativi, dati operativi relativi alle pratiche funerarie e contenuti commemorativi caricati nel Legacy Vault. Il trattamento è finalizzato alla gestione del servizio, alla comunicazione tra agenzia e familiari, alla redazione assistita dei contenuti e al rispetto degli obblighi normativi applicabili.'
    },
    {
      title: '2. Base giuridica e minimizzazione',
      text: 'Il trattamento avviene sulla base del contratto di servizio, del consenso esplicito per i contenuti commemorativi e degli obblighi legali in materia amministrativa. Applichiamo principi di minimizzazione: raccogliamo solo i dati necessari alla finalità dichiarata e limitiamo la diffusione interna ai soggetti autorizzati.'
    },
    {
      title: '3. Conservazione dei dati (Crittografia end-to-end)',
      text: 'I dati sono protetti con crittografia in transito e a riposo, con misure tecniche e organizzative adeguate alla natura sensibile delle informazioni. I contenuti del Vault sono conservati in ambienti segregati con controllo degli accessi, logging degli eventi e policy di retention coerenti con le preferenze della famiglia e con i tempi previsti dal servizio.'
    },
    {
      title: '4. Accesso, autorizzazioni e condivisione',
      text: 'L accesso è consentito esclusivamente a operatori abilitati e familiari autorizzati. Eventuali fornitori terzi agiscono come responsabili del trattamento sulla base di accordi contrattuali specifici e istruzioni documentate. Non cediamo i dati a terzi per finalità commerciali estranee al servizio.'
    },
    {
      title: '5. Diritti degli interessati (GDPR)',
      text: 'Gli interessati possono esercitare i diritti previsti dal GDPR: accesso, rettifica, cancellazione, limitazione, portabilità e opposizione nei limiti consentiti dalla normativa. Le richieste possono essere inviate al contatto privacy indicato nei canali ufficiali; forniamo riscontro entro i termini di legge.'
    },
    {
      title: '6. Contatti e aggiornamenti della policy',
      text: 'Per dubbi o segnalazioni sulla protezione dei dati è possibile contattare il team Lugubrious Hub. Questa informativa può essere aggiornata periodicamente per adeguamenti normativi o evoluzioni del servizio; la versione corrente è sempre disponibile in questa pagina.'
    }
  ],
  en: [
    {
      title: '1. Purpose of processing (Sensitive and commemorative data)',
      text: 'Lugubrious Hub processes identity data, operational data related to funeral cases, and commemorative content uploaded to the Legacy Vault. Processing is aimed at service delivery, agency-family communication, assisted content drafting, and compliance with applicable legal obligations.'
    },
    {
      title: '2. Legal basis and data minimization',
      text: 'Processing is based on the service agreement, explicit consent for commemorative content, and legal obligations for administrative workflows. We apply minimization principles: only data necessary for declared purposes is collected and internal sharing is restricted to authorized roles.'
    },
    {
      title: '3. Data retention (End-to-end encryption)',
      text: 'Data is protected with encryption in transit and at rest, supported by technical and organizational safeguards appropriate to sensitive information. Vault content is stored in segregated environments with access controls, event logging, and retention policies aligned with family preferences and service timelines.'
    },
    {
      title: '4. Access, permissions and sharing',
      text: 'Access is limited to authorized operators and enabled family members. Third-party providers, where involved, operate as data processors under specific contractual terms and documented instructions. We do not sell data for unrelated commercial purposes.'
    },
    {
      title: '5. Data subject rights (GDPR)',
      text: 'Data subjects may exercise GDPR rights: access, rectification, erasure, restriction, portability, and objection within legal limits. Requests can be submitted through official privacy contacts, and responses are provided within statutory deadlines.'
    },
    {
      title: '6. Contacts and policy updates',
      text: 'For questions or reports regarding data protection, users may contact the Lugubrious Hub team. This notice may be updated periodically for legal or service changes; the latest version is always available on this page.'
    }
  ]
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-semibold">{language === 'it' ? 'Privacy Policy' : 'Privacy Policy'}</h1>
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
