import { SHARED_KB, SUPPORT_PROMPT, SUPPORT_KB } from '../kb/shared.js';

function buildLanguageConstraint(language) {
  const langCode = language === 'en' ? 'en' : 'it';
  return `VINCOLO DI LINGUA ASSOLUTO: L'utente sta usando l'interfaccia nella lingua corrispondente al codice "${langCode}". Elabora queste istruzioni (anche se scritte in italiano) ma RISPONDI ESCLUSIVAMENTE IN QUESTA LINGUA. Adatta il tono, l'empatia e i termini tecnici alla lingua richiesta. MAI usare l'italiano se il codice non è "it".`;
}

function buildFlowPostscript(flow) {
  if (flow === 'b2b') {
    return `\n\n## Contesto Attuale: Flusso B2B (Agenzie)
Stai assistendo un operatore di un'agenzia funebre. Gestisci problemi tecnici del gestionale (preventivi, Stripe, Analytics) e richieste di necrologi per conto dell'agenzia. Tono professionale e risolutivo.`;
  }
  return `\n\n## Contesto Attuale: Flusso B2C (Famiglie)
Stai assistendo una famiglia dopo la scelta del servizio. Semplifica la burocrazia, genera necrologi con cura, e se rilevi ansia grave o blocchi legali suggerisci il contatto umano con l'operatore in sede a Portegrandi.`;
}

/**
 * Costruisce il system prompt completo per l'Agente Support.
 * Assembla: Language Constraint + Shared KB + Support Prompt STARS + Support KB + Flow Postscript
 *
 * @param {Object} params
 * @param {string} params.flow     - 'b2b' | 'b2c'
 * @param {string} params.language - 'it' | 'en'
 * @returns {string}
 */
export function buildSupportSystemPrompt({ flow, language }) {
  return [
    buildLanguageConstraint(language),
    SHARED_KB,
    SUPPORT_PROMPT,
    SUPPORT_KB,
    buildFlowPostscript(flow),
  ].join('\n\n');
}

/**
 * Costruisce il prompt specializzato per la generazione di necrologi.
 * Usato da /api/generate-obituary come override.
 *
 * @param {Object} params
 * @param {string} params.name     - Nome del defunto
 * @param {string} params.traits   - Tratti caratteriali
 * @param {string} params.language - 'it' | 'en'
 * @returns {string}
 */
export function buildObituaryPrompt({ name, traits, language }) {
  if (language === 'en') {
    return `You are an expert and delicate copywriter for a funeral agency. Write a short obituary (4-5 sentences maximum) for ${name}. Key traits: ${traits || 'not specified'}. Style: elegant, never overdramatic, celebrate the life. Never sound robotic or artificial.`;
  }
  return `Sei un copywriter esperto e delicato per un'agenzia funebre. Scrivi un necrologio breve (massimo 4-5 frasi) per ${name}. Tratti: ${traits || 'non specificati'}. Stile: elegante, mai eccessivamente drammatico, celebra la vita. Non sembrare mai artificiale o robotico.`;
}
