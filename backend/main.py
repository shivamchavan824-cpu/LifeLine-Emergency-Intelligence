import os
import json
import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from .models import IngestPayload, PipelineResult
from .pipeline import PipelineEngine

app = FastAPI(
    title="LifeLine Emergency Intelligence API",
    description="Deterministic and LLM-assisted emergency multi-modal extraction, verification, triage, and action engine.",
    version="1.0.0"
)

# CORS middleware for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
gemini_client = None

if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print("Gemini API Client successfully initialized.")
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini API Client: {e}. Fallback engine will be used.")
else:
    print("Notice: No GEMINI_API_KEY detected. Running in deterministic Zero-Key Demo Mode.")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "LifeLine Emergency Intelligence API",
        "gemini_active": gemini_client is not None,
        "mode": "Live LLM" if gemini_client else "Deterministic Zero-Key Mock/Offline Engine",
        "supported_languages": ["en", "hi", "mr"],
        "default_emergency_number": "112"
    }

@app.post("/api/pipeline/run", response_model=PipelineResult)
async def run_pipeline(payload: IngestPayload):
    try:
        # Offload CPU-bound inference/parsing to threadpool for non-blocking asynchronous event loop
        result = await asyncio.to_thread(PipelineEngine.run_pipeline, payload, gemini_client)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline processing failed: {str(e)}")

@app.get("/api/presets")
def get_presets():
    """Returns the 4 official demo presets for one-click testing by judges."""
    return [
        {
            "id": "preset-1",
            "title": "Preset 1: Panicked Voice Note + Heart Pill Strip",
            "tag": "Cardiac Emergency",
            "description": "Dad collapsed, sweating, chest pain + photo of heart pill strip (Sorbitrate 5mg).",
            "inputs": [
                {
                    "id": "inp-voice-1",
                    "type": "voice",
                    "title": "Bystander Panicked Audio Transcript",
                    "raw_content": "Help me please, my dad collapsed suddenly in the living room! He is sweating profusely, holding his chest with severe pain, and he takes some heart pill daily. He can barely talk!",
                    "timestamp": "2026-10-22T21:40:00Z",
                    "metadata": {"duration_sec": 14, "accent": "IN"}
                },
                {
                    "id": "inp-image-1",
                    "type": "image",
                    "title": "Uploaded Pill Blister Strip Photo",
                    "raw_content": "Prescription Blister Pack: Sorbitrate 5mg (Isosorbide Dinitrate sublingual tablets). Exp: 12/2027. Batch: SB-4421.",
                    "timestamp": "2026-10-22T21:40:45Z",
                    "metadata": {"source": "Camera OCR & Vision analysis", "filename": "pill_strip_sorbitrate.jpg"}
                }
            ]
        },
        {
            "id": "preset-2",
            "title": "Preset 2: Diabetic Patient Records + Sudden 103°F Fever",
            "tag": "Drug Interaction Alert",
            "description": "3-year chronic history of Metformin + acute high fever and rigors.",
            "inputs": [
                {
                    "id": "inp-doc-2",
                    "type": "document",
                    "title": "Scanned 3-Year EHR Medical Summary",
                    "raw_content": "Patient: Ramesh Sharma, 62M. Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension. Active Medications: Metformin 1000mg BID, Glimepiride 2mg OD, Atorvastatin 40mg. Coronary stent placed in LAD 2024.",
                    "timestamp": "2026-10-22T21:30:00Z",
                    "metadata": {"source": "Apollo Clinic PDF Export"}
                },
                {
                    "id": "inp-text-2",
                    "type": "text",
                    "title": "Caretaker Live Symptom Note",
                    "raw_content": "Patient developed sudden severe chills and a 103 degree fever today with vomiting. He is confused and breathing rapidly.",
                    "timestamp": "2026-10-22T21:42:00Z",
                    "metadata": {"source": "Caregiver Web Input"}
                }
            ]
        },
        {
            "id": "preset-3",
            "title": "Preset 3: Highway Road Accident + Live Traffic & Heavy Rain",
            "tag": "Trauma & Context Route",
            "description": "Accident scene with arterial delay, wet conditions, and route diversion.",
            "inputs": [
                {
                    "id": "inp-img-3",
                    "type": "image",
                    "title": "Traffic Camera & Scene Photo",
                    "raw_content": "Multi-vehicle collision on highway near Sector 44 junction. Two vehicles overturned. Suspected fractures and active bleeding. Head trauma noted in rear passenger.",
                    "timestamp": "2026-10-22T21:43:00Z",
                    "metadata": {"source": "Bystander Scene Camera Upload"}
                },
                {
                    "id": "inp-ctx-3",
                    "type": "context",
                    "title": "Live Weather & Traffic Feed",
                    "raw_content": "Highway Sector 44 corridor: Torrential rain, severe waterlogging, arterial roads jammed with 28-min delay. Alternate Flyover Green Corridor to Apex Trauma Center is clear.",
                    "timestamp": "2026-10-22T21:44:00Z",
                    "metadata": {"source": "Municipal Smart City Weather & Traffic API"}
                }
            ]
        },
        {
            "id": "preset-4",
            "title": "Preset 4: Conflicting Facts (Voice: 'No Allergies' vs. EHR: Penicillin)",
            "tag": "Verification & Clarification",
            "description": "Deliberately triggers VERIFY stage conflict and user clarification modal.",
            "inputs": [
                {
                    "id": "inp-voice-4",
                    "type": "voice",
                    "title": "Panicked Relative Audio Call",
                    "raw_content": "He has a deep infected wound and high fever, but he has NO ALLERGIES at all, he can take whatever antibiotic is available, please hurry!",
                    "timestamp": "2026-10-22T21:41:00Z",
                    "metadata": {"source": "Browser Speech Recognition"}
                },
                {
                    "id": "inp-doc-4",
                    "type": "document",
                    "title": "Hospital Discharge Note (2025)",
                    "raw_content": "CRITICAL ALERT: Patient suffered anaphylactic reaction to Amoxicillin in 2023. Confirmed severe Penicillin allergy. Strict avoidance of beta-lactams.",
                    "timestamp": "2026-10-22T21:41:30Z",
                    "metadata": {"source": "Max Healthcare Discharge Summary"}
                }
            ]
        }
    ]
