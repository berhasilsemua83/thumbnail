import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import { Download, Plus, Edit3, Trash2 } from 'lucide-react';

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontFamily: string;
  effect: string;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

interface EditorProps {
  bgImageBase64: string | null;
  texts: TextElement[];
  setTexts: React.Dispatch<React.SetStateAction<TextElement[]>>;
  aspectRatio: string;
  onEditWithAI: (prompt: string) => void;
  isEditingImage: boolean;
}

const FONT_OPTIONS = [
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Montserrat', value: '"Montserrat", sans-serif' },
  { label: 'Pacifico', value: '"Pacifico", cursive' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Orbitron', value: '"Orbitron", sans-serif' },
];

const EFFECT_OPTIONS = [
  'OUTLINE', 'DROP SHADOW', 'GLOW', 'NONE'
];

export default function Editor({ bgImageBase64, texts, setTexts, aspectRatio, onEditWithAI, isEditingImage }: EditorProps) {
  const [bgImage] = useImage(bgImageBase64 || '');
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [selectedId, selectShape] = useState<string | null>(null);
  
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editPos, setEditPos] = useState({ x: 0, y: 0 });

  const [aiPrompt, setAiPrompt] = useState('');

  // Calculate dimensions based on aspect ratio
  const containerWidth = 800;
  let containerHeight = 450; // 16:9
  if (aspectRatio === '9:16') containerHeight = 1422; // 800 * 16/9
  if (aspectRatio === '1:1') containerHeight = 800;

  // Scale to fit screen
  const scale = Math.min(1, 800 / containerWidth, 600 / containerHeight);
  const stageWidth = containerWidth * scale;
  const stageHeight = containerHeight * scale;

  useEffect(() => {
    if (selectedId && trRef.current) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'bg';
    if (clickedOnEmpty) {
      selectShape(null);
      setEditingTextId(null);
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    setTexts(texts.map(t => t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t));
  };

  const handleTransformEnd = (e: any, id: string) => {
    const node = stageRef.current.findOne(`#${id}`);
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    
    setTexts(texts.map(t => {
      if (t.id === id) {
        return {
          ...t,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          fontSize: Math.max(5, t.fontSize * scaleY),
          scaleX: 1,
          scaleY: 1,
        };
      }
      return t;
    }));
  };

  const handleDoubleClick = (e: any, id: string) => {
    const textNode = e.target;
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    
    setEditPos({
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    });
    setEditValue(texts.find(t => t.id === id)?.text || '');
    setEditingTextId(id);
  };

  const handleTextEditSubmit = () => {
    if (editingTextId) {
      setTexts(texts.map(t => t.id === editingTextId ? { ...t, text: editValue } : t));
      setEditingTextId(null);
    }
  };

  const handleDownload = () => {
    selectShape(null); // Deselect before download
    setTimeout(() => {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'thumbnail.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  };

  const addText = () => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: 'TEKS BARU',
      x: 50,
      y: 50,
      fontSize: 60,
      fill: '#FFFFFF',
      fontFamily: 'Impact, sans-serif',
      effect: 'OUTLINE',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    setTexts([...texts, newText]);
    selectShape(newText.id);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setTexts(texts.filter(t => t.id !== selectedId));
      selectShape(null);
    }
  };

  const updateSelectedText = (key: keyof TextElement, value: any) => {
    if (selectedId) {
      setTexts(texts.map(t => t.id === selectedId ? { ...t, [key]: value } : t));
    }
  };

  const selectedText = texts.find(t => t.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-white tracking-tight">Editor Visual</h2>
          <div className="h-6 w-px bg-white/10"></div>
          <button onClick={addText} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all border border-white/5 hover:border-white/10">
            <Plus size={16} /> Tambah Teks
          </button>
          {selectedId && (
            <button onClick={deleteSelected} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all border border-red-500/20">
              <Trash2 size={16} /> Hapus
            </button>
          )}
        </div>
        
        <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
          <Download size={18} /> Download
        </button>
      </div>

      {/* Toolbar for selected text */}
      {selectedText && (
        <div className="bg-slate-800/80 backdrop-blur-xl border-b border-white/10 p-3 flex items-center gap-6 z-10 overflow-x-auto shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Font</span>
            <select 
              value={selectedText.fontFamily} 
              onChange={(e) => updateSelectedText('fontFamily', e.target.value)}
              className="p-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warna</span>
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shadow-inner">
              <input 
                type="color" 
                value={selectedText.fill} 
                onChange={(e) => updateSelectedText('fill', e.target.value)}
                className="absolute top-[-10px] left-[-10px] w-12 h-12 cursor-pointer border-0 p-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efek</span>
            <select 
              value={selectedText.effect} 
              onChange={(e) => updateSelectedText('effect', e.target.value)}
              className="p-2 text-sm bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              {EFFECT_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-slate-800">{opt}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center relative">
        {/* Canvas Area */}
        <div className="bg-black/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 rounded-sm overflow-hidden" style={{ width: stageWidth, height: stageHeight }}>
          <Stage
            width={stageWidth}
            height={stageHeight}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
          >
            <Layer>
              {/* Background Image */}
              {bgImage ? (
                <KonvaImage image={bgImage} width={containerWidth} height={containerHeight} name="bg" />
              ) : (
                <Text text="Generate konsep untuk melihat gambar" x={containerWidth/2 - 180} y={containerHeight/2} fontSize={20} fill="#64748b" fontFamily="Inter, sans-serif" name="bg" />
              )}

              {/* Text Elements */}
              {texts.map((text) => {
                let stroke = '';
                let strokeWidth = 0;
                let shadowColor = '';
                let shadowBlur = 0;
                let shadowOffset = { x: 0, y: 0 };

                if (text.effect === 'OUTLINE') {
                  stroke = text.fill === '#FFFFFF' || text.fill === '#ffffff' ? '#000000' : '#FFFFFF';
                  strokeWidth = text.fontSize * 0.1;
                } else if (text.effect === 'DROP SHADOW') {
                  shadowColor = 'rgba(0,0,0,0.8)';
                  shadowBlur = 10;
                  shadowOffset = { x: 5, y: 5 };
                } else if (text.effect === 'GLOW') {
                  shadowColor = text.fill;
                  shadowBlur = 20;
                }

                return (
                  <Text
                    key={text.id}
                    id={text.id}
                    text={text.text}
                    x={text.x}
                    y={text.y}
                    fontSize={text.fontSize}
                    fontFamily={text.fontFamily}
                    fill={text.fill}
                    rotation={text.rotation}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    shadowColor={shadowColor}
                    shadowBlur={shadowBlur}
                    shadowOffsetX={shadowOffset.x}
                    shadowOffsetY={shadowOffset.y}
                    draggable
                    onClick={() => selectShape(text.id)}
                    onTap={() => selectShape(text.id)}
                    onDragEnd={(e) => handleDragEnd(e, text.id)}
                    onTransformEnd={(e) => handleTransformEnd(e, text.id)}
                    onDblClick={(e) => handleDoubleClick(e, text.id)}
                    onDblTap={(e) => handleDoubleClick(e, text.id)}
                    fontStyle="bold"
                  />
                );
              })}
              {selectedId && (
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 20 || newBox.height < 20) return oldBox;
                    return newBox;
                  }}
                  anchorStroke="#06b6d4"
                  anchorFill="#ffffff"
                  anchorSize={10}
                  borderStroke="#06b6d4"
                  borderDash={[5, 5]}
                />
              )}
            </Layer>
          </Stage>
        </div>

        {/* Inline Text Editor Overlay */}
        {editingTextId && (
          <div 
            className="absolute z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-xl shadow-2xl border border-white/20"
            style={{ top: editPos.y - 60, left: editPos.x }}
          >
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextEditSubmit();
              }}
              className="px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white font-bold min-w-[200px]"
            />
            <button onClick={handleTextEditSubmit} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:from-cyan-400 hover:to-blue-500 shadow-lg">
              Simpan
            </button>
          </div>
        )}
      </div>

      {/* AI Edit Prompt */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-t border-white/10 p-5 z-10">
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Edit3 className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ketik perintah edit AI (contoh: 'ganti background jadi kota malam', 'buat lebih dramatis')"
              className="block w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl leading-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm shadow-inner transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aiPrompt.trim() && !isEditingImage) {
                  onEditWithAI(aiPrompt);
                  setAiPrompt('');
                }
              }}
            />
          </div>
          <button
            onClick={() => {
              if (aiPrompt.trim() && !isEditingImage) {
                onEditWithAI(aiPrompt);
                setAiPrompt('');
              }
            }}
            disabled={isEditingImage || !aiPrompt.trim()}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] disabled:shadow-none flex items-center justify-center min-w-[140px]"
          >
            {isEditingImage ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Editing...
              </>
            ) : 'Edit via AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
