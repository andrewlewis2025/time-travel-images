
import React from 'react';
import type { UploadedImage } from '../types';
import { useMaskCanvas } from '../hooks/useMaskCanvas';

interface MaskEditorProps {
  uploadedImage: UploadedImage | null;
  onMaskUpdate: (maskDataUrl: string) => void;
}

export const MaskEditor: React.FC<MaskEditorProps> = ({ uploadedImage, onMaskUpdate }) => {
  const {
    canvasRef,
    brushColor,
    brushSize,
    setBrush,
    setBrushSize,
    clearMask,
    autoMask,
    fillWhite,
  } = useMaskCanvas(uploadedImage, onMaskUpdate);

  return (
    <div className="bg-white/10 backdrop-blur rounded-3xl p-6 space-y-5 border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-white">2. Paint the edit mask</h2>
        <div className="flex items-center gap-2">
          <button onClick={autoMask} disabled={!uploadedImage} className="text-sm font-medium text-sky-300 hover:text-sky-100 transition disabled:opacity-50 disabled:cursor-not-allowed">Lock face &amp; body</button>
          <button onClick={fillWhite} disabled={!uploadedImage} className="text-sm font-medium text-sky-300 hover:text-sky-100 transition disabled:opacity-50 disabled:cursor-not-allowed">Edit hair/clothes/bg</button>
        </div>
      </div>
      <div className="relative bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden aspect-square">
        {!uploadedImage && (
          <div className="absolute inset-3 text-sm text-slate-400 flex items-center justify-center pointer-events-none">
            Upload an image to unlock the canvas
          </div>
        )}
        <div className="relative w-full h-full">
          {uploadedImage && <img src={uploadedImage.dataUrl} alt="Mask background" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />}
          <canvas ref={canvasRef} className="mask-canvas absolute inset-0 w-full h-full" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <button
            onClick={() => setBrush('white')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${brushColor === 'white' ? 'bg-white text-slate-900' : ''}`}
          >
            Brush: Edit
          </button>
          <button
            onClick={() => setBrush('black')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${brushColor === 'black' ? 'bg-white text-slate-900' : ''}`}
          >
            Brush: Lock
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <span>Size</span>
          <input type="range" min="8" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="accent-sky-300" />
        </div>
        <button onClick={clearMask} disabled={!uploadedImage} className="text-sm font-medium text-sky-300 hover:text-sky-100 transition disabled:opacity-50 disabled:cursor-not-allowed">Clear mask</button>
      </div>
      <p className="text-xs text-slate-400">Tip: start with the preset, then refine edges using the brush or lock tool.</p>
    </div>
  );
};
