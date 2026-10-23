from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IngestInput(BaseModel):
    id: str = Field(..., description="Unique input identifier")
    type: str = Field(..., description="text, voice, image, document, context")
    title: str = Field(..., description="Brief label or source description")
    raw_content: str = Field(..., description="Text content or base64 / metadata summary")
    timestamp: str = Field(..., description="ISO timestamp")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class IngestPayload(BaseModel):
    case_id: Optional[str] = None
    inputs: List[IngestInput]
    country_code: str = Field(default="IN", description="ISO country code, default IN (112)")
    target_lang: str = Field(default="en", description="en, hi, mr")

class SourceRef(BaseModel):
    input_id: str
    source_type: str
    snippet: str

class ExtractedEntity(BaseModel):
    id: str
    category: str = Field(..., description="patient, symptom, medication, allergy, condition, location, hazard, timeline")
    name: str
    value: str
    unit: Optional[str] = None
    confidence: float = Field(..., ge=0.0, le=1.0)
    source: SourceRef
    status: str = Field(default="UNVERIFIED", description="VERIFIED, UNVERIFIED, CONFLICT")
    notes: Optional[str] = None

class ClarificationQuestion(BaseModel):
    id: str
    question: str
    category: str
    criticality: str = Field(..., description="HIGH, MEDIUM, LOW")
    related_entity_id: Optional[str] = None
    options: Optional[List[str]] = None

class VerificationFlag(BaseModel):
    entity_id: str
    flag_type: str = Field(..., description="CONTRADICTION, DRUG_INTERACTION, DOSAGE_ALERT, ALLERGY_ALERT, UNVERIFIED_SINGLE_SOURCE")
    severity: str = Field(..., description="CRITICAL, WARNING, INFO")
    message: str
    sources_involved: List[str]
    suggested_action: str

class TriageDecision(BaseModel):
    level: str = Field(..., description="CRITICAL, URGENT, STABLE")
    color: str = Field(..., description="red, amber, green")
    rationale: str
    evidence_factors: List[str]
    rule_applied: str

class EmergencyAction(BaseModel):
    id: str
    title: str
    description: str
    role: str = Field(..., description="Bystander, Paramedic, Family, Dispatcher")
    priority: int = Field(..., description="1 = highest")
    time_sensitivity: str = Field(..., description="Immediate (< 1 min), Under 5 min, Ongoing")
    evidence: str
    why: str

class HospitalOption(BaseModel):
    name: str
    distance_km: float
    eta_mins: int
    trauma_level: str
    specialties: List[str]
    traffic_status: str
    hazard_warning: Optional[str] = None
    phone: str

class PipelineResult(BaseModel):
    case_id: str
    inputs: List[IngestInput]
    extracted_entities: List[ExtractedEntity]
    verification_flags: List[VerificationFlag]
    clarification_questions: List[ClarificationQuestion]
    triage: TriageDecision
    actions: List[EmergencyAction]
    dispatcher_script: str
    handoff_summary: Dict[str, Any]
    nearest_hospitals: List[HospitalOption]
    context_warnings: List[str]
    country_code: str
    emergency_number: str
    safety_disclaimer: str = "LifeLine provides emergency decision support only. It does not replace medical diagnosis. Call local emergency services immediately if life is in danger."
