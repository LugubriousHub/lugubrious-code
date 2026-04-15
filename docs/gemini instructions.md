# Lugubrious Hub — Documentazione Tecnica Completa del Sistema Chatbot Multi-Agente

> Questo documento descrive in modo esaustivo il sistema chatbot di Lugubrious Hub: architettura, agenti, flussi, frasi trigger, struttura del codice e logica di routing. È pensato per essere letto da qualsiasi LLM o sviluppatore che debba comprendere, estendere o integrare il sistema.

---

## 1. Contesto del Progetto

**Lugubrious Hub** è una piattaforma SaaS premium per il settore funerario italiano, con sede operativa a Portegrandi (VE). Gestisce due flussi distinti:

- **B2B (Imprese Funebri):** Gestionale operativo, preventivi, logistica, Necrologi IA, integrazione Stripe.
- **B2C (Famiglie in lutto):** Organizzazione cerimonie, Split Payment tra familiari, supporto burocratico, Legacy Vault.

Il chatbot è l'interfaccia primaria di interazione tra la piattaforma e i suoi utenti. Non è un semplice FAQ bot: implementa un'architettura multi-agente in cui agenti specializzati si attivano dinamicamente in base al contesto conversazionale.

---

## 2. Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Runtime API | Node.js (non Edge — compatibilità @ai-sdk/openai) |
| LLM Provider | OpenAI via `@ai-sdk/openai@1.3.24` |
| AI SDK | Vercel AI SDK `ai@4.3.19` |
| Streaming | SSE nativo via `streamText` + `toDataStreamResponse()` |
| Frontend hook | `useChat` da `ai/react` |
| UI | React + Tailwind CSS (Dark Glass aesthetic) |
| Animazioni | Framer Motion (`AnimatePresence`) |
| Deploy | Vercel |
| Stato conversazione | Session-based, React state — nessun database |

**Variabile d'ambiente richiesta:** `OPENAI_API_KEY`

---

## 3. Architettura Multi-Agente

Il sistema è composto da **4 agenti**:

```
Utente
  │
  └─ POST /api/chat  { messages[], flow, language, currentAgent }
       │
       ├─ 1. Manager Agent  [gpt-4o-mini, temp=0, max_tokens=80]
       │      → legge history[-10] + currentAgent hint
       │      → output JSON: { "agent": "discovery|sales|support", "reason": "..." }
       │
       └─ 2. Specialist Agent  [gpt-4o, streaming, max_tokens=1024]
              → system prompt = Language Constraint + Shared KB + Agent Prompt + Agent KB + Flow Postscript
              → SSE stream → frontend
              → Header: X-Active-Agent: discovery|sales|support
```

### Modelli Usati

| Agente | Modello | Motivo |
|---|---|---|
| Manager | `gpt-4o-mini` | Classificazione pura, basso costo, ~200ms |
| Discovery | `gpt-4o` | Alta qualità empatica per prime interazioni |
| Sales | `gpt-4o` | Calcoli Split Payment, presentazione pacchetti |
| Support | `gpt-4o` | Necrologi IA, burocrazia complessa |

---

## 4. I 4 Agenti — Dettaglio

### 4.1 Manager Agent

**Ruolo:** Router silenzioso. Non parla mai con l'utente. L'unico output è un oggetto JSON.

**File:** `lib/agents/manager.js`

**Comportamento:**
- Legge gli ultimi 10 messaggi della conversazione
- Riceve il campo `currentAgent` (agente attualmente attivo) come hint
- Applica la **Regola di Continuità**: una volta che `sales` o `support` sono attivi, li mantiene a meno di un esplicito cambio di topic
- In caso di JSON non valido o errore, fa fallback su `discovery`

**Output JSON:**
```json
{ "agent": "discovery", "reason": "primo contatto, nessun intento espresso" }
```

**Visibilità UI:** Badge grigio `#94A3B8` — label "Analisi" (IT) / "Analysing" (EN). Appare per ~200ms durante il routing, poi cede il posto allo specialista attivato.

---

### 4.2 Discovery Agent

**Ruolo:** Qualifica l'utente con tatto ed empatia. Capisce se parla con una famiglia B2C o un'impresa B2B, e raccoglie informazioni base (tipo di esigenza, budget orientativo).

**File:** `lib/agents/discovery.js`

**Colore badge:** Viola `#6475FA` — label "Qualificazione" (IT) / "Qualification" (EN)

**Regole di comportamento:**
- Risposte brevi: massimo 3-4 frasi
- Un solo interrogativo alla volta
- MAI fare prezzi definitivi in questa fase
- MAI rivelare il routing ("ti passo alle vendite" = FAIL)
- Se B2C: tono solenne ed empatico
- Se B2B: tono professionale e orientato all'innovazione
- Se Generic (landing pubblica): tono neutro e accogliente, esplora l'intento prima di adottare il tono corretto

**System prompt assemblato da:**
1. Language Constraint (vincolo lingua assoluto)
2. `SHARED_KB` (identità brand, prezzi orientativi, Split Payment overview)
3. `DISCOVERY_PROMPT` (STARS framework: Scope, Tone, Action, Rules, Structure)
4. `DISCOVERY_KB` (matrici qualificazione B2C e B2B, segnali di handoff)
5. Flow Postscript (b2b / b2c / generic)

**Frasi trigger che attivano Discovery (o lo mantengono):**
- `Ciao, vorrei sapere cosa fate`
- `Non so da dove iniziare`
- `Buongiorno, ho bisogno di informazioni`
- `Mio padre è venuto a mancare ieri` *(avvia qualificazione B2C)*
- `Gestiamo un'agenzia funebre a Milano` *(avvia qualificazione B2B)*
- `Vorrei capire cosa offrite`
- `Siamo una piccola agenzia, potrebbe interessarci la piattaforma`
- `Hi, I need some information` *(EN)*
- `My mother passed away yesterday` *(EN, avvia B2C)*

---

### 4.3 Sales Agent

**Ruolo:** Subentro dopo la qualificazione. Presenta i pacchetti funerari (B2C) o i piani SaaS (B2B), gestisce il calcolo dello Split Payment e guida verso il checkout.

**File:** `lib/agents/sales.js`

**Colore badge:** Arancio `#E8650A` — label "Consulenza" (IT) / "Consultation" (EN)

**Regole di comportamento:**
- MAI applicare sconti al pacchetto Premium o ai piani Pro
- Usare sempre il blocco JSON `package` per i preventivi B2C
- Non ri-presentarsi se Discovery era già attivo
- Formula Split Payment: `Math.round(prezzo_totale / numero_persone)` — arrotondamento all'euro
- Mostrare sempre 2 opzioni in base al budget qualificato

**Listino B2C (Famiglie):**
- Pacchetto Essential: €2.800
- Pacchetto Premium: €5.500
- Cremazione Base: €2.200 (+ tasse comunali escluse)
- Legacy Vault (upsell): +€250

**Listino B2B (SaaS Agenzie):**
- Piano Basic: €129/mese (Gestione pratiche, 1 utente)
- Piano Pro: €299/mese (Necrologi IA, Split Payment integrato, Analytics)

**Esempi Split Payment:**
- €5.500 / 3 persone = €1.833 a persona
- €2.800 / 4 persone = €700 a persona
- €5.500 / 2 persone = €2.750 a persona

**System prompt assemblato da:**
1. Language Constraint
2. `SHARED_KB`
3. `SALES_PROMPT` (STARS framework)
4. `SALES_KB` (listini, regola Split Payment R2, gestione obiezioni)
5. Flow Postscript (b2b mostra piani SaaS, b2c mostra pacchetti cerimonia)

**Frasi trigger che attivano Sales:**
- `Quanto costa una cerimonia tradizionale?`
- `Quanto viene per la cremazione?`
- `Avete qualcosa sotto i 3000 euro?`
- `Che differenza c'è tra Essential e Premium?`
- `Cosa include esattamente il pacchetto Standard?`
- `Possiamo dividere la spesa tra fratelli?`
- `Siamo in 4, come funziona lo split payment?`
- `Vorrei un preventivo per una cerimonia laica`
- `Il Legacy Vault è incluso o costa extra?`
- `Ho un budget di circa 4000 euro, cosa consigliate?`
- `Quali piani SaaS offrite alle agenzie?` *(B2B)*
- `Cosa distingue il Piano Basic dal Pro?` *(B2B)*
- `€299 al mese include il supporto?` *(B2B)*
- `Gestisco 30 pratiche al mese, quale piano fa per me?` *(B2B)*
- `How much does a cremation package cost?` *(EN)*
- `What's included in the Premium plan?` *(EN)*
- `Can we split the cost between 4 siblings?` *(EN)*

**Frasi di follow-up che mantengono Sales (non regrediscono a Discovery):**
- `E poi?` / `Continua`
- `E lo split?`
- `Cosa include?`
- `Quanto verrebbe a persona?`
- `Ok, e il Premium?`
- `Avete anche altri pacchetti?`
- `Mi fate un confronto?`

---

### 4.4 Support Agent

**Ruolo:** Interviene dopo che un servizio è stato scelto o acquistato. Gestisce burocrazia, Necrologi IA e assistenza tecnica B2B.

**File:** `lib/agents/support.js`

**Colore badge:** Verde `#22C55E` — label "Assistenza" (IT) / "Support" (EN)

**Regole di comportamento:**
- Tono risolutivo e calmo ("non preoccuparti, ci pensiamo noi")
- Per problemi legali o blocchi cimiteriali: escalation all'operatore umano in sede a Portegrandi
- Per necrologi: stile elegante, mai robotico, 4-5 frasi massimo
- Input richiesti per necrologio: nome, età, passioni, chi dà l'annuncio

**Procedure burocratiche B2C:**
- Certificato di morte: acquisito automaticamente dall'agenzia entro 24h (famiglia non deve fare nulla)
- Autorizzazione cremazione: richiede firma del parente più prossimo o iscrizione al registro

**Assistenza tecnica B2B:**
- Gestionale non carica preventivi → refresh + verifica chiave Stripe
- Problemi di accesso → verifica credenziali e sessione attiva

**System prompt assemblato da:**
1. Language Constraint
2. `SHARED_KB`
3. `SUPPORT_PROMPT` (STARS framework, con regola escalation)
4. `SUPPORT_KB` (procedure burocratiche, istruzioni necrologi IA, assistenza tecnica)
5. Flow Postscript (b2b tecnico, b2c familiare con escalation umana)

**Funzione aggiuntiva:** `buildObituaryPrompt({ name, traits, language })` — usata da `/api/generate-obituary` per la pagina Necrologi standalone.

**Frasi trigger che attivano Support:**
- `Chi si occupa del certificato di morte?`
- `Mia madre voleva essere cremata, serve una firma?`
- `Dove si firma l'autorizzazione alla sepoltura?`
- `Abbiamo già scelto il pacchetto, ora cosa facciamo?`
- `Come funziona il Legacy Vault dopo la cerimonia?`
- `Potete scrivere il necrologio per mio padre? Si chiamava Giorgio, 82 anni, era un falegname`
- `Scrivi un ricordo per Laura, 71 anni, amava il giardinaggio`
- `Il gestionale non carica i nuovi preventivi` *(B2B)*
- `Non riesco ad accedere alla dashboard da ieri` *(B2B)*
- `La chiave Stripe risulta non valida nel pannello` *(B2B)*
- `Come genero un necrologio IA per un cliente?` *(B2B)*
- `Ho un problema con l'integrazione dei pagamenti` *(B2B)*
- `Who handles the death certificate?` *(EN)*
- `Can you write an obituary for my father?` *(EN)*

---

## 5. Struttura File del Progetto (Chatbot)

```
/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.js          ← Rotta principale streaming
│   │   └── generate-obituary/
│   │       └── route.js          ← Rotta standalone per Necrologi IA
│   ├── layout.js                 ← Include <PublicChatbot /> per pagine pubbliche
│   └── lib/
│       └── translations.js       ← Copy IT/EN per tutti i modi chatbot
│
├── components/
│   ├── SmartChatbot.js           ← Componente principale (useChat, badge, streaming)
│   └── PublicChatbot.js          ← Wrapper per landing/pagine pubbliche (mode="generic")
│
└── lib/
    ├── kb/
    │   └── shared.js             ← Tutte le KB bundlate come costanti JS
    └── agents/
        ├── manager.js            ← Router silenzioso (runManager)
        ├── discovery.js          ← buildDiscoverySystemPrompt
        ├── sales.js              ← buildSalesSystemPrompt
        └── support.js            ← buildSupportSystemPrompt + buildObituaryPrompt
```

---

## 6. Modalità del Chatbot

Il componente `SmartChatbot` accetta una prop `mode` che determina il contesto iniziale:

| mode | Dove appare | flow API | Badge iniziale | Welcome message |
|---|---|---|---|---|
| `"family"` | `/consumer/*` | `b2c` | Qualificazione | Messaggio empatico B2C |
| `"agency"` | `/b2b/*` | `b2b` | Qualificazione | Messaggio professionale B2B |
| `"generic"` | Landing + pagine pubbliche | `generic` | Qualificazione | Messaggio neutro di accoglienza |

### PublicChatbot — Logica di Esclusione

Il componente `PublicChatbot` legge il pathname corrente e renderizza `<SmartChatbot mode="generic" />` su tutte le pagine **tranne**:
- `/b2b/*` — ha il proprio chatbot `mode="agency"`
- `/consumer/*` — ha il proprio chatbot `mode="family"`
- `/dashboard/*` — area autenticata, nessun chatbot pubblico

---

## 7. Flusso API — `/api/chat/route.js`

### Request Body
```json
{
  "messages": [...],
  "flow": "b2c | b2b | generic",
  "language": "it | en",
  "forceAgent": "discovery | sales | support | null",
  "currentAgent": "discovery | sales | support"
}
```

### Response
- **Tipo:** SSE (Server-Sent Events) via `toDataStreamResponse()`
- **Header custom:** `X-Active-Agent: discovery | sales | support`
- Il frontend legge questo header in `onResponse` e aggiorna il badge

### Logica di Routing
1. Se `forceAgent` è presente e valido → salta il Manager, usa direttamente quello specialista
2. Altrimenti → chiama `runManager({ history, flow, language, currentAgent })`
3. Lo specialista selezionato genera la risposta in streaming
4. I messaggi con prefisso `__card:` vengono filtrati prima di essere inviati all'API (sono card locali del frontend)

### Fallback
- Manager con JSON non valido → `discovery`
- Qualsiasi errore nel Manager → `discovery`
- `OPENAI_API_KEY` mancante → 500 con messaggio esplicito

---

## 8. Flusso API — `/api/generate-obituary/route.js`

Rotta separata per la pagina `/b2b/necrologi` — genera necrologi standalone senza conversazione.

### Request Body
```json
{
  "name": "Nome del defunto",
  "traits": "Tratti caratteriali (opzionale)",
  "language": "it | en"
}
```

### Response
```json
{ "text": "Necrologio generato..." }
```

Usa `generateText` (non streaming) con `gpt-4o-mini` e il prompt da `buildObituaryPrompt()`.

---

## 9. Frontend — SmartChatbot.js

### Hook principale
```javascript
useChat({
  api: '/api/chat',
  body: { flow, language, currentAgent: activeAgentRef.current },
  onResponse: (res) => {
    setIsRouting(false);
    const agent = res.headers.get('X-Active-Agent');
    if (agent) { setActiveAgent(agent); activeAgentRef.current = agent; }
  },
  onError: () => {
    setIsRouting(false);
    // inietta messaggio di errore di default
  }
})
```

### Stati React
- `isOpen` — chatbot aperto/chiuso
- `activeAgent` — agente attivo ('discovery' | 'sales' | 'support')
- `isRouting` — true mentre il Manager sta decidendo (~200ms), mostra badge "Analisi"
- `isRecording` — registrazione vocale attiva
- `isDragging` — drag-and-drop file attivo

### `activeAgentRef`
Un `useRef` sincronizzato con `activeAgent` — permette di passare `currentAgent` nel body di `useChat` senza reinizializzare l'hook (il body in useChat è statico dopo l'init ma usa refs interni).

### Card Speciali (Messaggi Locali)
Messaggi iniettati localmente nel thread senza chiamare l'API, con prefisso `__card:`:

| Tipo | Trigger | Descrizione |
|---|---|---|
| `summaryCard` | Chip "Riassunto Giornata" (B2B) | Card con fatturato, pratiche, uso flotta |
| `ocrAction` | Upload immagine in modalità B2B | Bottoni per prefill o annulla OCR |
| `safety` | Parole distress in modalità B2C | Card ambra con bottone "Chiama il coordinatore" |

**Parole distress B2C:** `non capisco`, `aiuto`, `confuso`, `help`, `lost`

### Streaming Markdown
- Durante lo streaming (`isLoading && idx === lastAssistantIdx`): rendering plain-text, tabelle disabilitate per evitare artefatti
- A stream terminato: rendering completo con tabelle, heading, bold

---

## 10. Badge degli Agenti

| Agente | Colore | Label IT | Label EN | Quando appare |
|---|---|---|---|---|
| Manager | `#94A3B8` (slate) | Analisi | Analysing | ~200ms durante il routing |
| Discovery | `#6475FA` (viola) | Qualificazione | Qualification | Fase di qualificazione iniziale |
| Sales | `#E8650A` (arancio) | Consulenza | Consultation | Quando si parla di prezzi/pacchetti |
| Support | `#22C55E` (verde) | Assistenza | Support | Burocrazia, necrologi, tech support |

Il badge usa `AnimatePresence` con `key={displayedAgent}` per animare ogni transizione (fade + scale).

### Logica display
```javascript
const displayedAgent = isRouting ? 'manager' : activeAgent;
```

---

## 11. Knowledge Base — `lib/kb/shared.js`

Tutte le KB sono bundlate come costanti JS a build-time (nessuna chiamata `fs.readFile` — compatibile con Edge runtime se necessario in futuro):

| Costante | Contenuto |
|---|---|
| `SHARED_KB` | Identità brand, listino prezzi base, Split Payment overview |
| `DISCOVERY_PROMPT` | System prompt STARS per Discovery Agent |
| `DISCOVERY_KB` | Matrici qualificazione B2C/B2B, segnali di handoff |
| `SALES_PROMPT` | System prompt STARS per Sales Agent |
| `SALES_KB` | Listini completi, regola R2 Split Payment, gestione obiezioni |
| `SUPPORT_PROMPT` | System prompt STARS per Support Agent |
| `SUPPORT_KB` | Procedure burocratiche, istruzioni necrologi IA, assistenza tecnica |
| `MANAGER_PROMPT` | Regole di routing JSON, segnali chiave, regola di continuità |

---

## 12. Regola di Continuità del Routing

Questa è la regola più critica del Manager Agent: **una volta che `sales` o `support` sono attivi, rimangono attivi** a meno di un esplicito cambio di dominio da parte dell'utente.

Questo previene il problema di regressione (badge che torna a "Qualificazione" nel mezzo di una trattativa commerciale).

Il Manager riceve anche il campo `currentAgent` nel context message:
```
current_agent: "sales" (mantienilo se il contesto è coerente)
```

---

## 13. Internazionalizzazione

Il chatbot supporta italiano e inglese. Il `language` è determinato dal `LanguageProvider` globale.

Ogni agente ha un **Vincolo di Lingua Assoluto** iniettato in testa al system prompt:
> "Elabora queste istruzioni (anche se scritte in italiano) ma RISPONDI ESCLUSIVAMENTE IN QUESTA LINGUA."

I copy per il frontend (welcome message, chips, label badge, messaggi di errore) sono in `app/lib/translations.js` sotto `chatSmart.modes.{family|agency|generic}`.

---

## 14. Vincoli Architetturali Assoluti

| Codice | Vincolo |
|---|---|
| V1 | Tutte le risposte degli specialisti DEVONO essere in streaming (SSE) |
| V2 | Dark Glass UI: `bg-[#0B0F19]/90 backdrop-blur-3xl border border-white/10` |
| V3 | KB bundlata come costanti JS — nessuna lettura runtime di file `.md` |
| R1 | Tono sempre solenne/empatico, mai freddo o robotico |
| R2 | Split Payment: `Math.round(prezzo/n)`, mai sconti su Premium |
| R3 | Nessun agente rivela mai il routing all'utente |
| R4 | Nessun database — stato conversazione solo in React state |

---

## 15. Modifiche Apportate Rispetto al Codice Legacy

Il sistema originale era completamente non funzionante per i seguenti motivi:

1. **`client.responses.create()` non esiste in OpenAI SDK v4+** — ogni richiesta generava TypeError
2. **Architettura monolitica** — un unico system prompt per modalità, nessun routing
3. **Nessuno streaming** — risposta bloccante, UX scadente
4. **`Response.headers` immutabili** — tentativo di `response.headers.set()` falliva silenziosamente, generando sempre la risposta di errore di default

**Soluzione adottata:**
- Migrazione a Vercel AI SDK (`streamText`, `generateText`, `useChat`)
- Manager Agent con `gpt-4o-mini` a temperatura 0 per routing deterministico
- Header `X-Active-Agent` passato dentro `toDataStreamResponse({ headers: {} })` (unico punto mutabile)
- `useChat` sostituisce tutto il `fetch()` manuale
- Versioni pinnate: `ai@4.3.19` + `@ai-sdk/openai@1.3.24` (aligned su `@ai-sdk/provider@1.1.3`)
