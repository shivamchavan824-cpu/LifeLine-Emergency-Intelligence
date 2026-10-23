import React from 'react';
import { 
  ShieldAlert, HelpCircle, AlertCircle, FileCheck, Trash2, 
  CheckCircle, Database, GitCompare
} from 'lucide-react';

export function HumanInTheLoopModal({ 
  flags = [], 
  questions = [], 
  entities = [], 
  onResolveQuestion,
  onDeleteEntity
}) {
  return (
    <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl mb-6 relative border-amber-500/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Stage 3: Verification & Clinical Conflict Audit
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Audit Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero silent assumptions. Contradictions between caller speech and medical records are flagged for verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Database className="w-4 h-4 text-slate-500" />
          <span>Bundled Reference DB Matched</span>
        </div>
      </div>

      {/* 1. Critical Clarification Questions */}
      {questions.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            Active Human-In-The-Loop Clarification Prompt
          </div>
          {questions.map((q) => (
            <div key={q.id} className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/50 shadow-lg">
              <p className="text-sm font-bold text-rose-100 mb-3 leading-relaxed">
                {q.question}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => onResolveQuestion(q.id, opt)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-rose-600 hover:text-white border border-slate-700/80 transition-all duration-150 text-slate-200 active:scale-95 shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Flagged Verification Alerts */}
      {flags.length > 0 && (
        <div className="mb-6 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Clinical Contraindications & Contradictions ({flags.length})
          </div>
          <div className="grid gap-2.5">
            {flags.map((flag, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {flag.flag_type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Sources: {flag.sources_involved?.join(' ⇄ ')}
                    </span>
                  </div>
                  <p className="text-slate-100 font-semibold leading-relaxed">{flag.message}</p>
                  <p className="text-amber-400 font-medium mt-1.5 flex items-center gap-1.5">
                    <span className="font-bold">Required Action:</span> {flag.suggested_action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Extracted Clinical Facts Table */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Extracted Clinical Entities (User-Auditable)
          </div>
          <span className="text-[11px] text-slate-500">Tap trash icon to reject any fact</span>
        </div>

        <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 divide-y divide-slate-800/60">
          {entities.map((ent) => (
            <div key={ent.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-900/40 transition">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase ${
                  ent.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  ent.status === 'CONFLICT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
                  'bg-slate-800 text-slate-400 border border-slate-700/60'
                }`}>
                  {ent.status}
                </span>

                <div className="truncate">
                  <span className="text-slate-400 uppercase text-[10px] font-mono mr-1.5">
                    [{ent.category}]
                  </span>
                  <span className="font-bold text-white">{ent.name}</span>
                  {ent.value && ent.value !== ent.name && (
                    <span className="text-slate-300 ml-1.5 font-medium">({ent.value})</span>
                  )}
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">
                    • {ent.source?.source_type} ({Math.round(ent.confidence * 100)}% conf)
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDeleteEntity(ent.id)}
                title="Reject this extracted fact"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
