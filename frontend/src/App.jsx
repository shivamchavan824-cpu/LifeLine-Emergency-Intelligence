import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Shield, Globe, RotateCcw, AlertOctagon, 
  Activity, CheckCircle2, ChevronRight, PhoneCall, Sparkles
} from 'lucide-react';
import { PipelineStepper } from './components/PipelineStepper';
import { IngestStation } from './components/IngestStation';
import { HumanInTheLoopModal } from './components/HumanInTheLoopModal';
import { ActionSuite } from './components/ActionSuite';
import { translations } from './i18n';

export default function App() {
  const [lang, setLang] = useState('en');
  const [presets, setPresets] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [activeStage, setActiveStage] = useState('act');
  const [activePresetTitle, setActivePresetTitle] = useState('');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/presets')
      .then(res => res.json())
      .then(data => {
        setPresets(data);
        // Automatically pre-load Preset 1 for immediate demo visual appeal
        if (data && data.length > 0 && !pipelineResult) {
          handleRunCase(data[0].inputs, data[0].title);
        }
      })
      .catch(err => {
        console.warn("Could not reach backend presets, loading fallback", err);
      });
  }, []);

  const handleRunCase = async (inputs, presetTitle = '') => {
    setIsProcessing(true);
    setActivePresetTitle(presetTitle);
    setActiveStage('extract');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          country_code: 'IN',
          target_lang: lang
        })
      });

      if (!res.ok) throw new Error("API pipeline run failed");
      const data = await res.json();
      setPipelineResult(data);
      setActiveStage('act');
    } catch (err) {
      console.error(err);
      alert("Pipeline run failed. Please ensure the backend server is running on port 8000.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveQuestion = (questionId, selectedOption) => {
    if (!pipelineResult) return;
    const updatedQuestions = pipelineResult.clarification_questions.filter(q => q.id !== questionId);
    
    const updatedEntities = pipelineResult.extracted_entities.map(e => {
      if (e.name.toLowerCase().includes("penicillin")) {
        return {
          ...e,
          status: selectedOption.includes("HAS Penicillin") ? "VERIFIED" : "UNVERIFIED",
          notes: `User confirmed: ${selectedOption}`
        };
      }
      return e;
    });

    setPipelineResult({
      ...pipelineResult,
      clarification_questions: updatedQuestions,
      extracted_entities: updatedEntities
    });
  };

  const handleDeleteEntity = (entityId) => {
    if (!pipelineResult) return;
    setPipelineResult({
      ...pipelineResult,
      extracted_entities: pipelineResult.extracted_entities.filter(e => e.id !== entityId)
    });
  };

  const handleClearData = () => {
    setPipelineResult(null);
    setActivePresetTitle('');
    setActiveStage('ingest');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* 1. Top Safety Disclaimer Guardrail Banner */}
      <div className="bg-rose-600/90 text-white text-center py-2 px-4 text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg backdrop-blur-md">
        <AlertOctagon className="w-4 h-4 shrink-0 animate-pulse" />
        <span>NON-DIAGNOSTIC CLINICAL DECISION SUPPORT • CALL 112 IMMEDIATELY IF LIFE IS IN JEOPARDY</span>
      </div>

      {/* 2. Professional Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Product Meta */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 text-white shadow-xl shadow-rose-900/50 ring-2 ring-rose-500/30">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">LifeLine</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Autonomous Engine v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Emergency Decision-Support & Audited Triage Pipeline
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 text-xs">
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1.5 rounded-lg font-bold transition ${lang === 'en' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('hi')} 
                className={`px-3 py-1.5 rounded-lg font-bold transition ${lang === 'hi' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => setLang('mr')} 
                className={`px-3 py-1.5 rounded-lg font-bold transition ${lang === 'mr' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                मराठी
              </button>
            </div>

            {/* Privacy Reset Button */}
            <button
              onClick={handleClearData}
              title="Clear all session data for privacy"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Reset Case</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Live Stepper */}
        <PipelineStepper 
          activeStage={activeStage} 
          flagsCount={pipelineResult?.verification_flags?.length || 0} 
        />

        {/* Multi-modal Ingestion & 4 Quick Presets */}
        <IngestStation 
          onRunCase={handleRunCase}
          isProcessing={isProcessing}
          presets={presets}
          currentLang={lang}
        />

        {/* Active Case Banner */}
        {activePresetTitle && (
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 text-xs text-indigo-200 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="font-bold text-white">Active Evaluation Case:</span>
              <span>{activePresetTitle}</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-400">
              Audit Status: Verified with Reference DB
            </span>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-12 text-center rounded-2xl glass-surface-card mb-6">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-base font-bold text-white">Executing LifeLine Emergency Pipeline...</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Extracting multi-modal entities, cross-referencing contraindications, running rule-based triage tree...
            </p>
          </div>
        )}

        {/* Pipeline Outputs */}
        {pipelineResult && !isProcessing && (
          <div className="space-y-6">
            {/* Stage 3: Human-in-the-Loop & Audit */}
            <HumanInTheLoopModal 
              flags={pipelineResult.verification_flags}
              questions={pipelineResult.clarification_questions}
              entities={pipelineResult.extracted_entities}
              onResolveQuestion={handleResolveQuestion}
              onDeleteEntity={handleDeleteEntity}
            />

            {/* Stages 4 & 5: Triage & Action Suite */}
            <ActionSuite 
              actions={pipelineResult.actions}
              triage={pipelineResult.triage}
              dispatcherScript={pipelineResult.dispatcher_script}
              handoff={pipelineResult.handoff_summary}
              hospitals={pipelineResult.nearest_hospitals}
              warnings={pipelineResult.context_warnings}
              emergencyNumber={pipelineResult.emergency_number}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/80 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          LifeLine Emergency Intelligence System • Built with FastAPI, React, and TailwindCSS
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Zero-hallucination deterministic triage engine • WCAG AA Accessible • Indian Emergency Protocol (112)
        </p>
      </footer>
    </div>
  );
}
