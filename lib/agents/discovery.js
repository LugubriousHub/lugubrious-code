import { SHARED_KB, DISCOVERY_PROMPT, DISCOVERY_KB } from '../kb/shared.js';

function buildLanguageConstraint(language) {
  const langCode = language === 'en' ? 'en' : 'it';
  return `VINCOLO DI LINGUA ASSOLUTO: L'utente sta usando l'interfaccia nella lingua corrispondente al codice "${langCode}". Elabora queste istruzioni (anche se scritte in italiano) ma RISPONDI ESCLUSIVAMENTE IN QUESTA LINGUA. Adatta il tono, l'empatia e i termini tecnici alla lingua richiesta. MAI usare l'italiano se il codice non è "it".`;
}

function buildFlowPostscript(flow) {
  if (flow === 'b2b') {
    return `\n\n## Contesto Attuale: Flusso B2B
Stai parlando con un'impresa funebre o un operatore del settore. Usa il tono professionale ed efficiente. Orienta la qualificazione verso le dimensioni dell'agenzia, il volume pratiche e i pain point operativi. Non menzionare mai i pacchetti famiglia (B2C).`;
  }
  if (flow === 'generic') {
    return `\n\n## Contesto Attuale: Flusso Generico (Visitatore Non Autenticato)
Non sai ancora se l'interlocutore è una famiglia in lutto o un operatore del settore. Mantieni un tono accogliente, neutro e professionale. Esplora con delicatezza le esigenze dell'utente per capire a quale flusso appartiene. Se emergono segnali di un lutto recente, adotta il tono empatico del flusso B2C. Se emergono segnali di un operatore professionale, orienta verso il flusso B2B. Non rivelare mai i dettagli del routing interno.`;
  }
  return `\n\n## Contesto Attuale: Flusso B2C
Stai parlando con una famiglia in lutto. Usa il tono solenne ed empatico. Orienta la qualificazione verso il tipo di cerimonia, il budget orientativo e le esigenze particolari (Split Payment, Legacy Vault). Non menzionare mai i piani SaaS per agenzie.`;
}

/**
 * Costruisce il system prompt completo per l'Agente Discovery.
 * Assembla: Language Constraint + Shared KB + Discovery Prompt STARS + Discovery KB + Flow Postscript
 *
 * @param {Object} params
 * @param {string} params.flow     - 'b2b' | 'b2c'
 * @param {string} params.language - 'it' | 'en'
 * @returns {string}
 */
export function buildDiscoverySystemPrompt({ flow, language }) {
  return [
    buildLanguageConstraint(language),
    SHARED_KB,
    DISCOVERY_PROMPT,
    DISCOVERY_KB,
    buildFlowPostscript(flow),
  ].join('\n\n');
}
