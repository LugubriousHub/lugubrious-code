# Lugubrious Hub - Master Execution Protocol

## RUOLO
Agisci come Senior AI Architect & Lead UI Engineer. Il nostro obiettivo è la rifondazione completa dell'attuale chatbot di Lugubrious Hub (SaaS funerario) migrandolo verso un framework multi-agente ad alte prestazioni.

## TASK 1: Acquisizione Context & Knowledge Base
- Analizza approfonditamente tutti i file `.md` nella cartella `docs/` (01-10).
- Interiorizza l'identità del brand (Portegrandi, VE), la logica B2B/B2C, i listini prezzi e i vincoli tecnici.

## TASK 2: Mapping & Analisi del Debito Tecnico
- Identifica nel codice attuale (cartelle `/app`, `/components`, `/api`) dove risiede la logica del chatbot legacy.
- Individua le discrepanze tra l'implementazione attuale e il nuovo modello a 4 agenti (Manager, Discovery, Sales, Support).

## TASK 3: Fase di Pianificazione (Plan Mode)
Devi proporre un **Master Plan** in 5 Sprint per la mia approvazione:
- **Sprint 1:** Configurazione rotta API con logica di routing JSON del Manager Agent.
- **Sprint 2:** Integrazione dei 3 agenti specializzati (Discovery, Sales, Support) e caricamento dinamico delle KB verticali.
- **Sprint 3:** Refactoring UI con protocollo "Dark Glass" (Tailwind: `backdrop-blur-md`, `border-white/10`, `bg-black/40`) e compensazione header (`pt-32`).
- **Sprint 4:** Implementazione logica "Split Payment" visuale e tool di generazione Necrologi IA.
- **Sprint 5:** Audit finale, setup Vercel AI SDK streaming e bug-hunting.

## TASK 4: Vincoli Architetturali Assoluti
- **No Database:** La sessione deve essere gestita esclusivamente nello stato React del frontend. Nessun salvataggio persistente tra refresh.
- **Streaming Nativo:** Utilizza obbligatoriamente `ai` (Vercel AI SDK) per risposte immediate.
- **Design Consistency:** L'interfaccia deve riflettere l'agente attivo (Discovery: Viola `#6475FA`, Sales: Arancio `#E8650A`, Support: Verde `#22C55E`).

## REGOLA DI ESECUZIONE
NON SCRIVERE CODICE. Dopo aver letto questo file e analizzato il codice esistente, limitati a mappare la situazione attuale e proponimi la struttura del Master Plan per approvazione.