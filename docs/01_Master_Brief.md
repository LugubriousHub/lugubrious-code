# Lugubrious Hub - Master Brief

## 1. Obiettivo del Progetto
Costruire un ecosistema di assistenti AI integrato in Lugubrious Hub, una piattaforma SaaS premium per il settore funerario. Il sistema gestisce due flussi critici:
- **B2B (Imprese Funebri):** Supporto operativo, logistica e preventivazione complessa.
- **B2C (Famiglie):** Supporto empatico, organizzazione del rito e burocrazia smart.

## 2. Stack Tecnologico
- **Framework:** Next.js (App Router)
- **Frontend:** React, Tailwind CSS (Design "Dark Glass")
- **LLM:** Claude API (Anthropic)
- **AI SDK:** Vercel AI SDK (Streaming obbligatorio)
- **Deploy:** Vercel

## 3. Architettura Multi-Agente
- **Manager Agent:** Smista la conversazione tra B2B e B2C.
- **Discovery Agent:** Qualifica l'utente (Impresa o Famiglia) e i bisogni iniziali.
- **Sales Agent:** Gestisce la vendita di servizi e il calcolo dello "Split Payment".
- **Support Agent:** Assistenza burocratica, Necrologi IA e Legacy Vault.

## 4. Anti-Goals
- No Database (stato session-based).
- No Login obbligatorio per il chatbot.
- No transazioni reali (solo simulazione checkout).