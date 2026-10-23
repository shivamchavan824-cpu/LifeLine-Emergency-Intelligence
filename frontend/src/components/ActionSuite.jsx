import React, { useState } from 'react';
import { 
  PhoneCall, Copy, Check, Printer, Clock, ChevronDown, 
  ChevronUp, AlertCircle, ShieldAlert, ArrowRight, MapPin, Hospital, Activity
} from 'lucide-react';

export function ActionSuite({ 
  actions = [], 
  triage, 
  dispatcherScript, 
  handoff, 
  hospitals = [], 
  warnings = [],
  emergencyNumber = "112",
  lang = "en"
}) {
  const [copied, setCopied] = useState(false);
  const [expandedWhy, setExpandedWhy] = useState({});

  const handleCopyScript = () => {
    navigator.clipboard.writeText(dispatcherScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintHandoff = () => {
    window.print();
  };

  const toggleWhy = (id) => {
    setExpandedWhy(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isCritical = triage?.level === 'CRITICAL';
  const isUrgent = triage?.level === 'URGENT';

  return (
    <div className="space-y-6">
      {/* 1. Triage Banner & One-Tap 112 Call */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-all shadow-2xl relative overflow-hidden ${
        isCritical 
          ? 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border-rose-500 ring-2 ring-rose-500/20 glow-rose' 
          : isUrgent
          ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-amber-500 ring-2 ring-amber-500/20 glow-amber'
          : 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500 glow-emerald'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
                isCritical ? 'bg-rose-600 text-white animate-pulse' :
                isUrgent ? 'bg-amber-500 text-slate-950 font-bold' :
                'bg-emerald-600 text-white font-bold'
              }`}>
                {triage?.level || 'EVALUATING'}
              </span>
              <span className="font-mono text-xs text-slate-400 bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-slate-800">
                {triage?.rule_applied}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {triage?.rationale}
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {triage?.evidence_factors?.map((f, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Big One-Tap Emergency Button */}
          <div className="shrink-0 flex flex-col items-center sm:items-start lg:items-end">
            <a
              href={`tel:${emergencyNumber}`}
              className="flex items-center justify-center gap-3 px-8 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-2xl shadow-rose-900/60 transition-all duration-200 active:scale-95 group border border-rose-400/40"
            >
              <div className="p-2 rounded-xl bg-white/20 group-hover:scale-110 transition">
                <PhoneCall className="w-6 h-6 animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-widest text-rose-200 leading-tight">
                  1-Tap Instant Connect
                </div>
                <div>DIAL {emergencyNumber} NOW</div>
              </div>
            </a>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Line open on speaker • Geolocation transmitted
            </span>
          </div>
        </div>
      </div>

      {/* 2. Ready-to-Read 20-Second Dispatcher Teleprompter */}
      <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  20-Second Dispatcher Teleprompter Script
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Read Aloud
                </span>
              </div>
              <p className="text-xs text-slate-400">
                High-contrast teleprompter designed for panicked bystanders to read directly to dispatchers without freezing.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Script" : "Copy Teleprompter"}</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-indigo-500/30 text-indigo-100 font-mono text-sm sm:text-base leading-relaxed tracking-wide shadow-inner">
          <span className="text-rose-400 font-bold select-none">[READ INTO PHONE]: </span>
          "{dispatcherScript}"
        </div>
      </div>

      {/* 3. Prioritized Action Checklist with Role & Evidence */}
      <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Prioritized Clinical Action Protocol
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step emergency instructions assigned by stakeholder role (Bystander, Paramedic, Family).
          </p>
        </div>

        <div className="space-y-3">
          {actions.map((act) => (
            <div 
              key={act.id} 
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {act.priority}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{act.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{act.description}</p>
                    <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 font-semibold text-slate-300">
                        Assigned: {act.role}
                      </span>
                      <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        {act.time_sensitivity}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleWhy(act.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 transition flex items-center gap-1 shrink-0"
                >
                  <span>Evidence</span>
                  {expandedWhy[act.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {expandedWhy[act.id] && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs bg-slate-900/60 p-3.5 rounded-xl text-slate-300 space-y-1.5">
                  <p><strong className="text-slate-100">Why this recommendation:</strong> {act.why}</p>
                  <p><strong className="text-slate-100">Traceable Clinical Evidence:</strong> {act.evidence}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Paramedic & ER Handoff Summary (Print / Export Ready) */}
      <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl print-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 no-print">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Paramedic & ER Clinical Handoff Report
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                SBAR Standard Format
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant handoff summary ready for arriving paramedic crew or trauma bay handover.
            </p>
          </div>

          <button
            onClick={handlePrintHandoff}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Export / Print Handoff</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Chief Complaint & Acute Presentation
            </span>
            <span className="text-sm font-bold text-white leading-snug">
              {handoff?.patient_chief_complaint || "Unspecified Acute Distress"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Active Medications & Dosages
            </span>
            <span className="text-sm font-bold text-white">
              {handoff?.identified_medications?.length > 0 ? handoff.identified_medications.join(', ') : 'None Documented'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Verified Allergies
            </span>
            <span className="text-sm font-bold text-rose-400">
              {handoff?.known_allergies?.length > 0 ? handoff.known_allergies.join(', ') : 'No Known Drug Allergies (NKDA)'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block mb-1">
              Underlying Comorbidities
            </span>
            <span className="text-sm font-bold text-white">
              {handoff?.pre_existing_conditions?.length > 0 ? handoff.pre_existing_conditions.join(', ') : 'None on File'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Nearest Hospitals & Traffic-Aware Routing */}
      <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Nearest Emergency Trauma Hospitals & Corridor Routing
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time traffic-aware routing with verified cath lab, trauma center, and bypass status.
          </p>
        </div>

        {warnings.length > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              {warnings.map((w, idx) => (
                <p key={idx} className="font-semibold leading-relaxed">{w}</p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {hospitals.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-emerald-400 font-extrabold">{h.distance_km} km</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-800 font-mono font-bold text-white border border-slate-700">
                    ETA {h.eta_mins} mins
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white leading-snug">{h.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{h.trauma_level}</p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Traffic Corridor: <span className="text-slate-200 font-medium">{h.traffic_status}</span>
                </div>
                {h.hazard_warning && (
                  <div className="mt-2 text-[11px] text-rose-400 font-semibold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    ⚠️ {h.hazard_warning}
                  </div>
                )}
              </div>

              <a
                href={`tel:${h.phone}`}
                className="mt-4 w-full py-2 rounded-xl text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
              >
                Call Emergency Desk ({h.phone})
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
