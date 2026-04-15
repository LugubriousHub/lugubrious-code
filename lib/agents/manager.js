import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { MANAGER_PROMPT } from '../kb/shared.js';

const VALID_AGENTS = ['discovery', 'sales', 'support'];

/**
 * Manager Agent — routing silenzioso.
 * Non parla mai con l'utente. Legge la storia e restituisce quale specialista attivare.
 * Usa gpt-4o-mini per velocità (~200ms) e costo minimo.
 */
export async function runManager({ history, flow, language, currentAgent }) {
  try {
    const recentHistory = history.slice(-10);

    const agentHint = currentAgent && VALID_AGENTS.includes(currentAgent)
      ? ` current_agent: "${currentAgent}" (mantienilo se il contesto è coerente).`
      : '';

    const contextMessage = `Flow: ${flow}. Language: ${language}.${agentHint} Leggi la conversazione e decidi quale agente specialista deve rispondere al prossimo messaggio. Rispondi SOLO con JSON valido.`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: MANAGER_PROMPT,
      messages: [
        ...recentHistory,
        { role: 'user', content: contextMessage },
      ],
      maxTokens: 80,
      temperature: 0,
    });

    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return { agent: 'discovery', reason: 'fallback: nessun JSON trovato' };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const agent = VALID_AGENTS.includes(parsed.agent) ? parsed.agent : 'discovery';

    return { agent, reason: parsed.reason ?? '' };
  } catch (error) {
    console.error('[manager] Errore routing:', error);
    return { agent: 'discovery', reason: 'fallback: errore Manager' };
  }
}
