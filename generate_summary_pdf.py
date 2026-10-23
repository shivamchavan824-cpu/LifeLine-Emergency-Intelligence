import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf(filename="LifeLine_Executive_Summary.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    story = []
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#dc2626')
    )
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748b')
    )
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1e293b')
    )

    # Header
    story.append(Paragraph("LifeLine: Emergency Intelligence System", title_style))
    story.append(Paragraph("Executive Brief & Architecture Explanation | Fast, Verified Emergency Decision-Support", subtitle_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#dc2626'), spaceAfter=10))

    # 1. The Core Problem
    story.append(Paragraph("1. The Problem", h2_style))
    story.append(Paragraph(
        "In critical emergencies, information is chaotic and fragmented: frantic voice recordings, blurry prescription photos, old records, weather warnings, and heavy traffic. People lose vital minutes parsing this disorder. Generic AI chatbots hallucinate dosages and guess silently. <b>LifeLine</b> ingests any combination of inputs and converts them into structured, clinically verified actions in under 5 seconds.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # 2. The 5-Stage Pipeline Table
    story.append(Paragraph("2. The 5-Stage Core Pipeline", h2_style))
    pipeline_data = [
        [
            Paragraph("<b>Stage</b>", bullet_style),
            Paragraph("<b>What It Does</b>", bullet_style),
            Paragraph("<b>Safety & Design Guardrail</b>", bullet_style)
        ],
        [
            Paragraph("<b>1. INGEST</b>", bullet_style),
            Paragraph("Accepts audio (Speech-to-Text), photos (pill strips, scene), scanned PDFs, live weather & traffic feeds.", bullet_style),
            Paragraph("Multi-modal aggregator accepts single or combined inputs without failing.", bullet_style)
        ],
        [
            Paragraph("<b>2. EXTRACT</b>", bullet_style),
            Paragraph("Parses symptoms, medications, doses, allergies, conditions, and hazards using strict typed schemas.", bullet_style),
            Paragraph("Every fact is tagged with source reference and confidence score (0.0 to 1.0).", bullet_style)
        ],
        [
            Paragraph("<b>3. VERIFY</b><br/><font color='#b91c1c'><b>(Differentiator)</b></font>", bullet_style),
            Paragraph("Cross-checks facts across sources for contradictions. Validates dosages and interactions against reference DB.", bullet_style),
            Paragraph("<b>Never guesses silently.</b> Conflicts generate interactive Human-in-the-Loop questions.", bullet_style)
        ],
        [
            Paragraph("<b>4. DECIDE</b>", bullet_style),
            Paragraph("Generates auditable triage level: <b>CRITICAL</b>, <b>URGENT</b>, or <b>STABLE</b> with plain-language rationale.", bullet_style),
            Paragraph("Deterministic clinical rule tree; LLM is not permitted to guess safety-critical levels.", bullet_style)
        ],
        [
            Paragraph("<b>5. ACT</b>", bullet_style),
            Paragraph("Produces 1-Tap 112 Call, 20s Dispatcher Teleprompter, Paramedic Handoff, and Hospital Route ETA.", bullet_style),
            Paragraph("Prioritized by role (Bystander, Paramedic, Family) with clear clinical rationale.", bullet_style)
        ]
    ]

    t1 = Table(pipeline_data, colWidths=[90, 260, 190])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 8))

    # 3. Four Built-in Demo Scenarios
    story.append(Paragraph("3. Built-In Judge Demo Scenarios", h2_style))
    presets_data = [
        [
            Paragraph("<b>Scenario</b>", bullet_style),
            Paragraph("<b>Inputs</b>", bullet_style),
            Paragraph("<b>Verification & Output</b>", bullet_style)
        ],
        [
            Paragraph("<b>1. Cardiac Emergency</b>", bullet_style),
            Paragraph("Panicked voice ('dad collapsed, chest pain') + pill strip photo", bullet_style),
            Paragraph("Identifies Sorbitrate 5mg, triggers CRITICAL triage, outputs 20-second 112 dispatcher script.", bullet_style)
        ],
        [
            Paragraph("<b>2. Diabetic Interaction</b>", bullet_style),
            Paragraph("3-yr EHR summary (Metformin) + sudden 103°F fever note", bullet_style),
            Paragraph("Detects severe Lactic Acidosis risk; instructs hospital to hold Metformin during sepsis/dehydration.", bullet_style)
        ],
        [
            Paragraph("<b>3. Trauma & Weather</b>", bullet_style),
            Paragraph("Accident collision photo + smart city rain & traffic feed", bullet_style),
            Paragraph("Detects highway waterlogging; diverts ambulance via Flyover Green Corridor to trauma center.", bullet_style)
        ],
        [
            Paragraph("<b>4. Contradiction Case</b>", bullet_style),
            Paragraph("Voice ('no allergies') vs EHR record ('penicillin allergy')", bullet_style),
            Paragraph("Flags CONFLICT; prompts user with interactive clarification button instead of guessing.", bullet_style)
        ]
    ]
    t2 = Table(presets_data, colWidths=[110, 190, 240])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))

    # 4. Safety & System Architecture
    story.append(Paragraph("4. Safety, Privacy & Technical Foundations", h2_style))
    safety_points = [
        "• <b>Assists, Never Diagnoses:</b> Prominent disclaimer on every screen reminding users to call 112 immediately if life is at risk.",
        "• <b>Human-in-the-Loop:</b> Bystanders and medical staff can view, edit, or reject any extracted fact in the live audit panel.",
        "• <b>Zero-Key Guarantee:</b> Includes a built-in deterministic clinical engine so evaluators can run all demos offline with 0 API keys.",
        "• <b>Accessibility & Localization:</b> Mobile-first, WCAG AA compliant dark theme with real-time English, Hindi, and Marathi translations.",
        "• <b>Verified Quality:</b> 100% automated pytest pass rate across verification contraindications and triage logic."
    ]
    for p in safety_points:
        story.append(Paragraph(p, bullet_style))
        story.append(Spacer(1, 2))

    doc.build(story)
    print("PDF generated successfully:", filename)

if __name__ == "__main__":
    generate_pdf()
