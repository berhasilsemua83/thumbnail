import React from 'react';
import { ThumbnailConcept } from '../services/ai';
import { Lightbulb, Image as ImageIcon, Type, Layout, Terminal } from 'lucide-react';

interface ConceptPanelProps {
  concept: ThumbnailConcept | null;
}

export default function ConceptPanel({ concept }: ConceptPanelProps) {
  if (!concept) return null;

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="bg-slate-900/60 backdrop-blur-xl px-6 py-5 border-b border-white/10 shadow-sm">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
          <Lightbulb className="text-amber-400" size={20} />
          Konsep AI
        </h2>
      </div>
      <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Lightbulb size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">1. Hook Idea</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{concept.hookIdea}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ImageIcon size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">2. Visual Thumbnail</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{concept.visualThumbnail}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Type size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">3. Teks Thumbnail</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {concept.thumbnailText.map((text, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 text-white text-xs font-bold rounded-lg border border-white/10 shadow-sm">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Layout size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">4. Positioning Teks</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{concept.positioning}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              <Terminal size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">5. Final Prompt</h3>
            <p className="text-xs font-mono text-slate-300 bg-black/40 p-4 rounded-xl border border-white/10 break-words shadow-inner">
              {concept.finalPrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
