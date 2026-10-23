# LifeLine: Emergency Intelligence System

> **Turning chaotic, messy emergency inputs into structured, verified, life-saving actions in seconds.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Python: 3.14](https://img.shields.io/badge/Python-3.14-blue.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.161.1-green.svg)](#)
[![React: 18](https://img.shields.io/badge/React-18-blue.svg)](#)
[![TailwindCSS: v4](https://img.shields.io/badge/TailwindCSS-v4-blueviolet.svg)](#)

---

## 🚨 Problem Statement
In real-world medical emergencies, critical information arrives in pieces: panicked voice calls, blurry photos of pill strips, crumbled hospital discharge papers, weather warnings, and gridlocked traffic. People lose vital minutes trying to synthesize this information. 

**LifeLine** ingests ANY combination of these inputs, extracts clinical entities, verifies them against deterministic drug/allergy databases, determines an auditable triage score, and outputs immediate life-saving actions.

---

## ⚡ The 5-Stage Pipeline
1. **INGEST**: Ingests multi-modal inputs: Browser Speech-to-Text, text notes, photos of prescriptions or wounds, scanned EHR records, and live weather/traffic feeds.
2. **EXTRACT**: Strict schema extraction identifying patient vitals, symptoms, medications with dosages, allergies, and environmental hazards with source references and confidence scores (0-1).
3. **VERIFY (Key Differentiator)**:
   - Cross-checks facts across multiple inputs to catch contradictions (e.g., voice note claims "no allergies", but record documents Penicillin allergy).
   - Validates drug interactions and dosages against a bundled clinical reference database.
   - **Never silently guesses**: Ambiguous or conflicting facts trigger an interactive Human-in-the-Loop Clarification Prompt.
4. **DECIDE**: Transparent rule-based triage (`CRITICAL` / `URGENT` / `STABLE`) with traceable clinical rationale.
5. **ACT**:
   - One-Tap Call to local emergency dispatch (**112** for India, configurable).
   - Word-for-word **20-Second Dispatcher Script** (read aloud teleprompter).
   - Standardized **Paramedic / ER Handoff Report** (printable and exportable).
   - Nearest emergency hospitals with traffic and flood-aware ETAs.

---

## 🎯 Quick Start (One Command)

### 1. Start the Backend (FastAPI)
```bash
python -m uvicorn backend.main:app --port 8000
```
Backend API will run at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

> **Zero-Key Guarantee:** LifeLine is pre-configured with a deterministic clinical engine and mock fallback mode. **Judges and evaluators do not need any API keys** to run all four test cases end-to-end. (If a `GEMINI_API_KEY` is provided in the environment, the LLM bridge activates automatically).

---

## 🧪 Automated Unit Testing
Run the verification and triage test suite with `pytest`:
```bash
python -m pytest -v
```
All tests validate:
- Cardiac emergency red flag detection and critical dispatch assignment.
- Metformin accumulation and lactic acidosis interaction during acute high fever.
- Contradiction flagging and clarification prompt generation.

---

## 🌍 Multi-Lingual & Accessibility
- **Languages**: English, Hindi (हिन्दी), Marathi (मराठी).
- **Design**: WCAG AA high-contrast dark mode, large touch targets, 10-second panic usability.

---

## 🛡️ Safety & Trust Guardrails
- **Assistance, Not Diagnosis**: LifeLine explicitly acts as decision support; it never replaces emergency medical personnel.
- **Human-In-The-Loop**: Users can edit or reject any extracted fact before actions are confirmed.
- **Privacy by Design**: In-memory session processing; "Reset / Clear All Data" button permanently wipes context.
