import pytest
from .models import IngestPayload, IngestInput
from .pipeline import PipelineEngine

def test_preset_1_cardiac_triage():
    payload = IngestPayload(
        country_code="IN",
        target_lang="en",
        inputs=[
            IngestInput(
                id="i1",
                type="voice",
                title="Voice input",
                raw_content="Dad collapsed, chest pain, sweating heavily, takes heart pill",
                timestamp="2026-10-22T21:00:00Z"
            ),
            IngestInput(
                id="i2",
                type="image",
                title="Pill strip",
                raw_content="Sorbitrate 5mg blister pack",
                timestamp="2026-10-22T21:00:10Z"
            )
        ]
    )
    result = PipelineEngine.run_pipeline(payload)
    assert result.triage.level == "CRITICAL"
    assert result.emergency_number == "112"
    assert any("sorbitrate" in e.name.lower() for e in result.extracted_entities if e.category == "medication")
    assert any("chest pain" in e.name.lower() for e in result.extracted_entities if e.category == "symptom")
    assert len(result.actions) >= 2
    assert "112" in result.dispatcher_script

def test_preset_2_diabetic_fever_interaction():
    payload = IngestPayload(
        country_code="IN",
        target_lang="en",
        inputs=[
            IngestInput(
                id="i1",
                type="document",
                title="Record",
                raw_content="Type 2 Diabetes Mellitus, Metformin 1000mg twice daily",
                timestamp="2026-10-22T21:00:00Z"
            ),
            IngestInput(
                id="i2",
                type="text",
                title="Symptom",
                raw_content="Sudden severe fever 103 degrees, shivering and vomiting",
                timestamp="2026-10-22T21:00:10Z"
            )
        ]
    )
    result = PipelineEngine.run_pipeline(payload)
    assert result.triage.level in ["CRITICAL", "URGENT"]
    # Check that drug interaction flag was raised
    flag_types = [f.flag_type for f in result.verification_flags]
    assert "DRUG_INTERACTION" in flag_types

def test_preset_4_conflict_detection():
    payload = IngestPayload(
        country_code="IN",
        target_lang="en",
        inputs=[
            IngestInput(
                id="i1",
                type="voice",
                title="Caller",
                raw_content="He has fever and wound, no allergies to any medicines",
                timestamp="2026-10-22T21:00:00Z"
            ),
            IngestInput(
                id="i2",
                type="document",
                title="Hospital Record",
                raw_content="Confirmed severe Penicillin allergy, history of anaphylaxis",
                timestamp="2026-10-22T21:00:10Z"
            )
        ]
    )
    result = PipelineEngine.run_pipeline(payload)
    conflict_flags = [f for f in result.verification_flags if f.flag_type == "CONTRADICTION"]
    assert len(conflict_flags) > 0
    assert len(result.clarification_questions) > 0
    # Must NOT guess silently
    assert any("penicillin" in q.question.lower() for q in result.clarification_questions)
