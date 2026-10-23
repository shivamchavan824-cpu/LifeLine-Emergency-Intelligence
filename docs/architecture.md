# LifeLine System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph INGEST ["1. INGESTION STAGE"]
        A1[Panicked Voice Audio / Speech-to-Text] --> AGG[Multi-Modal Aggregator]
        A2[Prescription / Scene / Report Photos] --> AGG
        A3[Scanned Medical Records & PDFs] --> AGG
        A4[Live Weather & Traffic APIs] --> AGG
        A5[Direct Text / Bystander Inputs] --> AGG
    end

    subgraph EXTRACT ["2. EXTRACTION STAGE"]
        AGG --> EXT[Strict Schema Parser & LLM Bridge]
        EXT --> ENT1[Patient Profile & Vitals]
        EXT --> ENT2[Reported Symptoms & Timeline]
        EXT --> ENT3[Medications & Dosages]
        EXT --> ENT4[Documented Allergies]
        EXT --> ENT5[Location & Environmental Hazards]
    end

    subgraph VERIFY ["3. VERIFICATION STAGE (Differentiator)"]
        ENT1 & ENT2 & ENT3 & ENT4 & ENT5 --> CC[Cross-Source Contradiction Detector]
        REF[(Bundled Clinical Database: Drug Interactions & Allergy Matrix)] --> REF_CHK[Reference Match Engine]
        ENT3 & ENT4 --> REF_CHK
        CC --> CONFLICT{Contradiction Detected?}
        CONFLICT -- Yes --> CLAR[Human-In-The-Loop Clarification Prompt]
        CONFLICT -- No --> STAT[Status: VERIFIED or UNVERIFIED]
        REF_CHK --> FLAGS[Interaction & Dosage Red Flags]
    end

    subgraph DECIDE ["4. DECISION STAGE"]
        STAT & FLAGS & CLAR --> RULE[Deterministic Rule-Based Triage Matrix]
        RULE --> T1[CRITICAL: Immediate Threat to Life]
        RULE --> T2[URGENT: Rapid Evaluation Required]
        RULE --> T3[STABLE: Non-Emergent / Baseline Safe]
    end

    subgraph ACT ["5. ACTION STAGE"]
        T1 & T2 & T3 --> CALL[1-Tap Emergency Call: 112 / Configurable]
        T1 & T2 & T3 --> SCRIPT[20-Second Dispatcher Teleprompter Script]
        T1 & T2 & T3 --> HANDOFF[Paramedic ER Handoff Report PDF / Link]
        T1 & T2 & T3 --> ROUTE[Nearest Hospital Routing + Traffic ETA]
        T1 & T2 & T3 --> WARN[Context Alerts: Waterlogging / Flood Warning]
    end
```

## Safety & Trust Model
1. **Decision-Support Non-Diagnostic Policy**: LifeLine explicitly acts as an emergency coordination assistant. It NEVER claims definitive clinical diagnosis.
2. **Deterministic Triage**: The triage level (CRITICAL / URGENT / STABLE) is generated through audited rule trees, avoiding LLM hallucination for safety-critical calls.
3. **Never Guess Silently**: Conflicting information triggers an interactive clarification prompt rather than choosing one fact probabilistically.
