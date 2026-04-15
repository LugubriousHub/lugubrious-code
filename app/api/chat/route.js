import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { runManager } from '../../../lib/agents/manager.js';
import { buildDiscoverySystemPrompt } from '../../../lib/agents/discovery.js';
import { buildSalesSystemPrompt } from '../../../lib/agents/sales.js';
import { buildSupportSystemPrompt } from '../../../lib/agents/support.js';

export const runtime = 'nodejs';

const AGENT_BUILDERS = {
  discovery: buildDiscoverySystemPrompt,
  sales: buildSalesSystemPrompt,
  support: buildSupportSystemPrompt,
};

export async function POST(request) {
  // 1. Validazione env var — fallimento esplicito
  if (!process.env.OPENAI_API_KEY) {
    console.error('[chat] OPENAI_API_KEY mancante nel server environment');
    return new Response(
      JSON.stringify({ error: 'API Key mancante.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();

    const messages = body?.messages ?? [];
    const flow = (body?.flow ?? 'b2c').toString().toLowerCase();
    const language = (body?.language ?? 'it').toString().toLowerCase();
    const forceAgent = body?.forceAgent ?? null;
    const currentAgent = body?.currentAgent ?? null;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Messaggio obbligatorio.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filtra i messaggi card locali prima di passarli al modello
    const cleanHistory = messages
      .slice(0, -1)
      .filter((m) => !m.content?.startsWith('__card:'));

    // 2. Routing silenzioso via Manager Agent
    let activeAgent = forceAgent;
    if (!activeAgent || !AGENT_BUILDERS[activeAgent]) {
      const { agent } = await runManager({
        history: cleanHistory,
        flow,
        language,
        currentAgent,
      });
      activeAgent = agent;
    }

    // 3. System prompt dello specialista
    const buildPrompt = AGENT_BUILDERS[activeAgent] ?? buildDiscoverySystemPrompt;
    const systemPrompt = buildPrompt({ flow, language });

    const cleanMessages = messages.filter((m) => !m.content?.startsWith('__card:'));

    // 4. Stream con gpt-4o — header passato dentro toDataStreamResponse (Response è immutabile)
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: cleanMessages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse({
      headers: { 'X-Active-Agent': activeAgent },
    });
  } catch (error) {
    console.error('[chat] Errore durante la richiesta al modello:', error);
    return new Response(
      JSON.stringify({ error: 'Errore durante la richiesta al modello.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
