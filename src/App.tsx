import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor, { TextElement } from './components/Editor';
import ConceptPanel from './components/ConceptPanel';
import { generateConcept, generateThumbnailImage, editThumbnailImage, ThumbnailConcept } from './services/ai';

export default function App() {
  const [input, setInput] = useState('');
  const [imageUpload, setImageUpload] = useState<string | null>(null);
  const [mode, setMode] = useState('CURIOSITY + SOFT SELLING');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [fontStyle, setFontStyle] = useState('BOLD/IMPACT');
  const [textEffect, setTextEffect] = useState('OUTLINE');
  const [template, setTemplate] = useState('');

  const [concept, setConcept] = useState<ThumbnailConcept | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    try {
      // 1. Generate Concept
      const generatedConcept = await generateConcept(
        input, mode, aspectRatio, fontStyle, textEffect, template
      );
      setConcept(generatedConcept);

      // 2. Generate Image based on finalPrompt
      const generatedImage = await generateThumbnailImage(
        generatedConcept.finalPrompt,
        aspectRatio,
        imageUpload || undefined
      );
      setBgImage(generatedImage);

      // 3. Setup Texts
      const newTexts: TextElement[] = generatedConcept.thumbnailText.map((text, index) => {
        let yPos = 50 + (index * 80);
        let xPos = 50;
        
        // Basic positioning logic based on AI output
        const posStr = generatedConcept.positioning.toLowerCase();
        if (posStr.includes('tengah') || posStr.includes('center')) {
          xPos = 200;
          yPos = 200 + (index * 80);
        } else if (posStr.includes('bawah') || posStr.includes('bottom')) {
          yPos = 300 + (index * 80);
        } else if (posStr.includes('kanan') || posStr.includes('right')) {
          xPos = 400;
        }

        return {
          id: `text-${Date.now()}-${index}`,
          text: text,
          x: xPos,
          y: yPos,
          fontSize: 60,
          fill: '#FFFFFF',
          fontFamily: fontStyle.includes('BOLD') ? 'Impact, sans-serif' : '"Montserrat", sans-serif',
          effect: textEffect,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        };
      });
      setTexts(newTexts);

    } catch (error) {
      console.error("Error generating thumbnail:", error);
      alert("Gagal membuat thumbnail. Pastikan API key valid dan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditWithAI = async (prompt: string) => {
    if (!bgImage) return;
    setIsEditingImage(true);
    try {
      const editedImage = await editThumbnailImage(prompt, bgImage);
      setBgImage(editedImage);
    } catch (error) {
      console.error("Error editing image:", error);
      alert("Gagal mengedit gambar. Coba lagi dengan prompt yang berbeda.");
    } finally {
      setIsEditingImage(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Sidebar
        input={input} setInput={setInput}
        imageUpload={imageUpload} setImageUpload={setImageUpload}
        mode={mode} setMode={setMode}
        aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
        fontStyle={fontStyle} setFontStyle={setFontStyle}
        textEffect={textEffect} setTextEffect={setTextEffect}
        template={template} setTemplate={setTemplate}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
        </div>

        <div className="flex-1 flex overflow-hidden z-10">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col relative">
            <Editor
              bgImageBase64={bgImage}
              texts={texts}
              setTexts={setTexts}
              aspectRatio={aspectRatio}
              onEditWithAI={handleEditWithAI}
              isEditingImage={isEditingImage}
            />
          </div>
          
          {/* Concept Panel */}
          {concept && (
            <div className="w-96 bg-slate-900/30 backdrop-blur-md border-l border-white/10 overflow-y-auto shadow-2xl z-20 custom-scrollbar">
              <ConceptPanel concept={concept} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
