import React from 'react';
import { 
  Layers, Cpu, ShieldCheck, Activity, Send, CheckCircle2, AlertCircle
} from 'lucide-react';

const STAGES = [
  { 
    key: 'ingest', 
    stepNumber: '01', 
    name: 'INGEST', 
    icon: Layers, 
    desc: 'Multi-Modal Streams',
    detail: 'Voice, OCR, EHR & Context' 
  },
  { 
    key: 'extract', 
    stepNumber: '02', 
    name: 'EXTRACT', 
    icon: Cpu, 
    desc: 'Schema Parser',
    detail: 'Pydantic Strict Schemas' 
  },
  { 
    key: 'verify', 
    stepNumber: '03', 
    name: 'VERIFY', 
    icon: ShieldCheck, 
    desc: 'Cross-Source Audit',
    detail: 'Contraindications & Conflicts',
    isDifferentiator: true
  },
  { 
    key: 'decide', 
    stepNumber: '04', 
    name: 'DECIDE', 
    icon: Activity, 
    desc: 'Deterministic Triage',
    detail: 'Zero-Guessing Clinical Tree' 
  },
  { 
    key: 'act', 
    stepNumber: '05', 
    name: 'ACT', 
    icon: Send, 
    desc: 'Emergency Suite',
    detail: '112 Call, Script & Routes' 
  }
];

export function PipelineStepper({ activeStage = 'act', flagsCount = 0 }) {
  const getStageIndex = (key) => STAGES.findIndex(s => s.key === key);
  const activeIdx = getStageIndex(activeStage) >= 0 ? getStageIndex(activeStage) : 4;

  return (
    <div className="w-full glass-surface-card rounded-2xl p-4 sm:p-5 shadow-2xl mb-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-slate-300">
                Autonomous Emergency Pipeline
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                LIVE <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-ping"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic clinical execution • 5/5 Stages active with zero hallucination
            </p>
          </div>
        </div>

        {flagsCount > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{flagsCount} Clinical Contradiction / Flag Highlighted</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Audit Trail Verified</span>
          </div>
        )}
      </div>

      {/* Modern Stepper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {STAGES.map((stg, idx) => {
          const Icon = stg.icon;
          const isPassed = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div
              key={stg.key}
              className={`relative flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-gradient-to-b from-rose-500/20 to-slate-900 border-rose-500/80 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                  : isPassed
                  ? 'bg-slate-900/60 border-slate-700/60 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60'
              }`}
            >
              {stg.isDifferentiator && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                  Core Differentiator
                </span>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">
                  {stg.stepNumber}
                </span>
                <div className={`p-1.5 rounded-lg ${
                  isCurrent 
                    ? 'bg-rose-500 text-white' 
                    : isPassed 
                    ? 'bg-slate-800 text-emerald-400' 
                    : 'bg-slate-900 text-slate-600'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-tight text-white">
                  {stg.name}
                </span>
                {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
              </div>

              <span className="text-[11px] font-medium text-slate-300 mt-0.5 truncate">
                {stg.desc}
              </span>
              <span className="text-[10px] text-slate-400 truncate mt-0.5">
                {stg.detail}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
