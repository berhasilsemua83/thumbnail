import React from 'react';
import { Upload, X } from 'lucide-react';

interface SidebarProps {
  input: string;
  setInput: (val: string) => void;
  imageUpload: string | null;
  setImageUpload: (val: string | null) => void;
  mode: string;
  setMode: (val: string) => void;
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  fontStyle: string;
  setFontStyle: (val: string) => void;
  textEffect: string;
  setTextEffect: (val: string) => void;
  template: string;
  setTemplate: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function Sidebar({
  input, setInput,
  imageUpload, setImageUpload,
  mode, setMode,
  aspectRatio, setAspectRatio,
  fontStyle, setFontStyle,
  textEffect, setTextEffect,
  template, setTemplate,
  onGenerate, isGenerating
}: SidebarProps) {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 h-screen overflow-y-auto flex flex-col shadow-2xl custom-scrollbar z-20">
      <div className="p-6 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1 tracking-tight">Thumbnail AI</h1>
          <p className="text-sm text-slate-400 font-medium">Ubah narasi jadi thumbnail High CTR</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Narasi / Skrip Video</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm text-white placeholder-slate-600 shadow-inner"
            placeholder="Masukkan narasi video, skrip, artikel, atau ide konten Anda di sini..."
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-300">Gambar Referensi (Opsional)</label>
          {imageUpload ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg group">
              <img src={imageUpload} alt="Upload" className="w-full h-32 object-cover" />
              <button
                onClick={() => setImageUpload(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 hover:border-cyan-500/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-2 text-cyan-500/70" />
                <p className="text-xs text-slate-400 font-medium">Klik untuk upload gambar</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        <div className="space-y-4">
          {[
            { label: 'Mode', value: mode, setter: setMode, options: [
              {v: 'CURIOSITY + SOFT SELLING', l: 'Curiosity + Soft Selling (Default)'},
              {v: 'HARD SELLING', l: 'Hard Selling'},
              {v: 'SOFT SELLING', l: 'Soft Selling'},
              {v: 'CURIOSITY', l: 'Curiosity'},
              {v: 'SHOCK / VIRAL', l: 'Shock / Viral'},
              {v: 'AESTHETIC', l: 'Aesthetic'}
            ]},
            { label: 'Aspek Rasio', value: aspectRatio, setter: setAspectRatio, options: [
              {v: '16:9', l: '16:9 (YouTube)'},
              {v: '9:16', l: '9:16 (TikTok/Reels/Shorts)'},
              {v: '1:1', l: '1:1 (Instagram Feed)'}
            ]},
            { label: 'Gaya Font', value: fontStyle, setter: setFontStyle, options: [
              {v: 'BOLD/IMPACT', l: 'Bold / Impact'},
              {v: 'MODERN/CLEAN', l: 'Modern / Clean'},
              {v: 'HANDWRITING/CASUAL', l: 'Handwriting / Casual'},
              {v: 'SERIF/KLASIK', l: 'Serif / Klasik'},
              {v: 'TECHY/FUTURISTIK', l: 'Techy / Futuristik'}
            ]},
            { label: 'Efek Teks', value: textEffect, setter: setTextEffect, options: [
              {v: 'OUTLINE', l: 'Outline'},
              {v: 'DROP SHADOW', l: 'Drop Shadow'},
              {v: 'GLOW', l: 'Glow'},
              {v: 'KOTAK BACKGROUND', l: 'Kotak Background'},
              {v: 'GRADIENT TEXT', l: 'Gradient Text'},
              {v: '3D EFFECT', l: '3D Effect'},
              {v: 'STROKE GANDA', l: 'Stroke Ganda'}
            ]}
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
              <select value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full p-2.5 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none">
                {field.options.map(opt => <option key={opt.v} value={opt.v} className="bg-slate-800">{opt.l}</option>)}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Template (Opsional)</label>
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full p-2.5 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none">
              <option value="" className="bg-slate-800">-- Tidak Pakai Template --</option>
              <option value="[T1] GAMING EPIC" className="bg-slate-800">[T1] Gaming Epic</option>
              <option value="[T2] TUTORIAL / EDUKASI" className="bg-slate-800">[T2] Tutorial / Edukasi</option>
              <option value="[T3] BERITA / VIRAL / FAKTUAL" className="bg-slate-800">[T3] Berita / Viral / Faktual</option>
              <option value="[T4] VLOG / LIFESTYLE" className="bg-slate-800">[T4] Vlog / Lifestyle</option>
              <option value="[T5] BISNIS / MOTIVASI" className="bg-slate-800">[T5] Bisnis / Motivasi</option>
              <option value="[T6] SAINS / TEKNOLOGI" className="bg-slate-800">[T6] Sains / Teknologi</option>
              <option value="[T7] MASAK / FOOD" className="bg-slate-800">[T7] Masak / Food</option>
              <option value="[T8] HORROR / MISTERI" className="bg-slate-800">[T8] Horror / Misteri</option>
              <option value="[T9] FITNESS / HEALTH" className="bg-slate-800">[T9] Fitness / Health</option>
              <option value="[T10] TRAVEL / WISATA" className="bg-slate-800">[T10] Travel / Wisata</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !input.trim()}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:shadow-none flex items-center justify-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Thumbnail'
          )}
        </button>
      </div>
    </div>
  );
}
