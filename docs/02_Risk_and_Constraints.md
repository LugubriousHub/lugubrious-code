# Lugubrious Hub - Rischi e Vincoli

## 1. Rischi Architetturali
- **R1 - Sensibilità del Tono:** L'IA deve mantenere un tono solenne ed empatico (B2C) senza diventare fredda o eccessivamente commerciale.
- **R2 - Calcolo Prezzi:** Errori nel calcolo dello "Split Payment" possono generare sfiducia. Mitigazione: logica di calcolo deterministica via JSON.

## 2. Vincoli Tecnici
- **V1:** Ogni risposta deve essere in streaming.
- **V2:** Il design deve rispettare l'estetica "Dark Glass" (blur, bordi bianchi 10%, bg nero 40%).
- **V3:** La Knowledge Base deve essere letta esclusivamente da file `.md` statici.