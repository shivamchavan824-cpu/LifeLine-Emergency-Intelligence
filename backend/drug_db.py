"""
LifeLine Bundled Clinical Reference Dataset.
Deterministic rules for critical contraindications, drug-drug interactions,
allergy cross-reactivity, and dosage safety checks.
"""

# Severe Drug-Drug Interactions
DRUG_INTERACTIONS = [
    {
        "drug_a": "aspirin",
        "drug_b": "warfarin",
        "severity": "CRITICAL",
        "message": "High risk of life-threatening gastrointestinal or intracranial hemorrhage.",
        "action": "Do NOT administer additional Aspirin without direct medical control clearance."
    },
    {
        "drug_a": "aspirin",
        "drug_b": "clopidogrel",
        "severity": "WARNING",
        "message": "Dual antiplatelet effect increases severe bleeding risk.",
        "action": "Verify emergency protocol before giving emergency antiplatelet dose."
    },
    {
        "drug_a": "nitroglycerin",
        "drug_b": "sildenafil",
        "severity": "CRITICAL",
        "message": "Severe refractory hypotension and circulatory collapse.",
        "action": "Absolute contraindication! Do not administer nitroglycerin if PDE-5 inhibitor taken within 24-48 hours."
    },
    {
        "drug_a": "metformin",
        "drug_b": "iodinated contrast",
        "severity": "WARNING",
        "message": "Risk of contrast-induced nephropathy and severe lactic acidosis.",
        "action": "Alert ER triage for immediate renal function panel before IV contrast scan."
    },
    {
        "drug_a": "ciprofloxacin",
        "drug_b": "metformin",
        "severity": "WARNING",
        "message": "Increased risk of severe hypoglycemia.",
        "action": "Continuous blood glucose monitoring required immediately."
    },
    {
        "drug_a": "lisinopril",
        "drug_b": "spironolactone",
        "severity": "WARNING",
        "message": "Risk of severe hyperkalemia leading to cardiac arrest.",
        "action": "Order stat serum potassium upon ER admission."
    }
]

# Drug-Allergy Matrix
ALLERGY_CROSS_REACTIONS = [
    {
        "allergy": "penicillin",
        "contraindicated_drugs": ["amoxicillin", "ampicillin", "augmentin", "piperacillin", "cephalexin"],
        "severity": "CRITICAL",
        "message": "Patient has documented Penicillin allergy. Beta-lactam antibiotic administration can trigger anaphylaxis.",
        "action": "Avoid all penicillins and early-generation cephalosporins; prepare IM Epinephrine if given in error."
    },
    {
        "allergy": "sulfa",
        "contraindicated_drugs": ["bactrim", "septra", "sulfamethoxazole", "furosemide"],
        "severity": "WARNING",
        "message": "Potential cross-reactivity with sulfonamide compounds.",
        "action": "Choose alternative non-sulfa antimicrobial or diuretic."
    },
    {
        "allergy": "aspirin",
        "contraindicated_drugs": ["aspirin", "ibuprofen", "naproxen", "diclofenac", "nsaids"],
        "severity": "CRITICAL",
        "message": "Severe bronchospasm or anaphylactoid reaction from NSAID/Aspirin triad.",
        "action": "Do NOT administer aspirin even in acute chest pain if confirmed aspirin allergy."
    }
]

# Standard Dosage Limits & Frequency Sanity
DOSAGE_LIMITS = {
    "aspirin": {
        "max_single_emergency_dose_mg": 325,
        "max_daily_mg": 4000,
        "standard_emergency_chewable_mg": 325,
        "warning": "Emergency chewable dose is 162-325 mg. Higher doses elevate bleeding complications."
    },
    "nitroglycerin": {
        "max_single_sublingual_mg": 0.4,
        "max_doses_in_15_mins": 3,
        "warning": "Max 3 doses spaced 5 minutes apart. Check BP > 90 mmHg before every dose."
    },
    "metformin": {
        "max_single_dose_mg": 1000,
        "max_daily_mg": 2550,
        "warning": "Daily dose exceeding 2550 mg triggers high lactic acidosis risk."
    },
    "paracetamol": {
        "max_single_dose_mg": 1000,
        "max_daily_mg": 4000,
        "warning": "Excessive dose risks acute fulminant hepatotoxicity."
    }
}

# Red Flag Condition Cues
CRITICAL_CONDITIONS_RED_FLAGS = {
    "cardiac": ["chest pain", "crushing chest pressure", "diaphoresis", "sweating", "radiating jaw pain", "left arm pain", "shortness of breath", "collapsed", "unconscious"],
    "stroke": ["facial droop", "arm weakness", "slurred speech", "sudden numbness", "loss of vision", "fast symptoms"],
    "anaphylaxis": ["stridor", "wheezing", "throat tightness", "swollen tongue", "hives", "hypotension"],
    "trauma": ["arterial bleeding", "spurting blood", "head trauma", "flail chest", "penetrating wound", "unresponsive"],
    "diabetic_crisis": ["fever with diabetes", "glucose > 300", "fruity breath", "severe vomiting", "lethargy", "confusion", "dka risk"]
}
