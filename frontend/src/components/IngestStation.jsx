import React, { useState } from 'react';
import { 
  Sparkles, Mic, MicOff, Image, FileText, Send, Zap, 
  ArrowUpRight
} from 'lucide-react';

export function IngestStation({ onRunCase, isProcessing, presets = [], currentLang = "en" }) {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const toggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not natively supported in this browser. Please type or click one of the Judge presets.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : (currentLang === 'mr' ? 'mr-IN' : 'en-US');
        
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setTextInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleSimulateFileUpload = (type, title, sampleContent) => {
    setAttachedFiles(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        type,
        title,
        raw_content: sampleContent,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleManualSubmit = () => {
    if (!textInput.trim() && attachedFiles.length === 0) return;
    const inputs = [];
    if (textInput.trim()) {
      inputs.push({
        id: `inp-manual-${Date.now()}`,
        type: isRecording ? 'voice' : 'text',
        title: isRecording ? 'Live Voice Recording' : 'Direct Emergency Input',
        raw_content: textInput,
        timestamp: new Date().toISOString()
      });
    }
    inputs.push(...attachedFiles);
    onRunCase(inputs, "Custom Multi-Modal Submission");
  };

  return (
    <div className="glass-surface-card rounded-2xl p-5 sm:p-6 shadow-2xl mb-6 relative">
      {/* 1. Judge Presets Section */}
      <div className="mb-6 pb-5 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide uppercase">
                One-Click Official Judge Presets
              </h2>
              <p className="text-[11px] text-slate-400">
                Click any case to test end-to-end multi-modal ingestion, conflict detection, and triage logic.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400 self-start sm:self-auto">
            Zero API Key Needed • 100% Deterministic
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onRunCase(p.inputs, p.title)}
              disabled={isProcessing}
              className="text-left p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800/80 hover:border-rose-500/50 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/15 transition"></div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
                    {p.tag}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition leading-snug">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-rose-400 group-hover:text-rose-300">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Run Case
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Live Custom Multi-modal Ingestion */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Or Compose Live Multi-Modal Emergency Input
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateFileUpload("image", "Accident Scene Photo", "Multiple vehicle collision, highway sector 44, severe compound fracture, wet road.")}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition active:scale-95"
            >
              <Image className="w-3.5 h-3.5 text-sky-400" />
              + Scene Photo
            </button>
            <button
              onClick={() => handleSimulateFileUpload("document", "Apollo Clinic Record", "Patient 62M, Type 2 Diabetes, on Metformin 1000mg BID, documented Penicillin allergy.")}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              + EHR Record
            </button>
          </div>
        </div>

        {/* Text Area & Voice Input */}
        <div className="relative">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type or dictate emergency details (e.g., 'Dad collapsed in the living room, sweating, severe chest pressure, takes heart medication...')"
            rows={3}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition resize-none pr-32"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              title={isRecording ? "Stop voice dictation" : "Start browser voice dictation"}
              className={`p-2 rounded-xl border transition ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse border-rose-500 shadow-lg shadow-rose-900/50' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleManualSubmit}
              disabled={isProcessing || (!textInput.trim() && attachedFiles.length === 0)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white flex items-center gap-1.5 transition shadow-lg shadow-rose-900/40 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Analyze
            </button>
          </div>
        </div>

        {/* Attached Items Pills */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {attachedFiles.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-200">
                {f.type === 'image' ? <Image className="w-3.5 h-3.5 text-sky-400" /> : <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="font-semibold">{f.title}</span>
                <button
                  onClick={() => setAttachedFiles(prev => prev.filter(x => x.id !== f.id))}
                  className="hover:text-rose-400 ml-1 font-bold text-slate-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
