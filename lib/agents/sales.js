import { SHARED_KB, SALES_PROMPT, SALES_KB } from '../kb/shared.js';

function buildLanguageConstraint(language) {
  const langCode = language === 'en' ? 'en' : 'it';
  return `VINCOLO DI LINGUA ASSOLUTO: L'utente sta usando l'interfaccia nella lingua corrispondente al codice "${langCode}". Elabora queste istruzioni (anche se scritte in italiano) ma RISPONDI ESCLUSIVAMENTE IN QUESTA LINGUA. Adatta il tono, l'empatia e i termini tecnici alla lingua richiesta. MAI usare l'italiano se il codice non è "it".`;
}

function buildFlowPostscript(flow) {
  if (flow === 'b2b') {
    return `\n\n## Contesto Attuale: Flusso B2B (Agenzie)
Stai presentando i piani SaaS a un'impresa funebre. Proponi il Piano Basic (€129/mese) per agenzie piccole o il Piano Pro (€299/mese) per agenzie medie/grandi. Non menzionare i pacchetti cerimonia B2C.`;
  }
  return `\n\n## Contesto Attuale: Flusso B2C (Famiglie)
Stai presentando i pacchetti cerimonia a una famiglia in lutto. Proponi sempre due opzioni in base al budget qualificato. Se il budget è inferiore a €3.000, presenta Essential e Cremazione Base. Se superiore, presenta Essential e Premium. Non menzionare mai i piani SaaS per agenzie.`;
}

/**
 * Costruisce il system prompt completo per l'Agente Sales.
 * Assembla: Language Constraint + Shared KB + Sales Prompt STARS + Sales KB (con regola Split Payment) + Flow Postscript
 *
 * @param {Object} params
 * @param {string} params.flow     - 'b2b' | 'b2c'
 * @param {string} params.language - 'it' | 'en'
 * @returns {string}
 */
export function buildSalesSystemPrompt({ flow, language }) {
  return [
    buildLanguageConstraint(language),
    SHARED_KB,
    SALES_PROMPT,
    SALES_KB,
    buildFlowPostscript(flow),
  ].join('\n\n');
}
