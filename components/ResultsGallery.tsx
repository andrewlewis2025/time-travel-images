
import React from 'react';
import { decadeStyles } from '../services/geminiService';
import type { GeneratedImage } from '../types';

interface ResultsGalleryProps {
  generatedImages: GeneratedImage[];
  onDownloadAll: () => void;
  onImageSelect: (image: GeneratedImage) => void;
}

const GallerySlot: React.FC<{ decade: string; result?: GeneratedImage; onSelect: (image: GeneratedImage) => void; }> = ({ decade, result, onSelect }) => {
  const description = decadeStyles[decade] || 'Decade style description';
  const status = result?.status;
  const imageUrl = result?.imageUrl;

  const content = (
    <>
      <div className="aspect-square rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:opacity-80 transition-opacity">
        {status === 'success' && imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" alt={`${decade} result`} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm p-2 text-center">
            {status === 'error' ? `Error: Generation failed` : `${decade} preview`}
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-100">{decade}</p>
        <p className="text-xs text-slate-400 truncate" title={description}>{description}</p>
      </div>
    </>
  );

  if (status === 'success' && result) {
    return (
      <button 
        className="flex flex-col gap-2 bg-slate-950/50 border border-white/10 rounded-2xl p-3 text-left w-full group focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all hover:border-white/20 hover:scale-105"
        onClick={() => onSelect(result)}
        aria-label={`View ${decade} result`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-slate-950/50 border border-white/10 rounded-2xl p-3">
      {content}
    </div>
  );
};

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({ generatedImages, onDownloadAll, onImageSelect }) => {
    const decades = Object.keys(decadeStyles);
    const hasSuccessfulDownloads = generatedImages.some(img => img.status === 'success');
  return (
    <section className="bg-white/10 backdrop-blur rounded-3xl p-6 space-y-4 border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-white">3. Results gallery</h2>
        <button
          onClick={onDownloadAll}
          disabled={!hasSuccessfulDownloads}
          className="px-4 py-2 rounded-full border border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-slate-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Download all
        </button>
      </div>
      <div id="gallery" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {decades.map(decade => {
            const result = generatedImages.find(img => img.decade === decade);
            return <GallerySlot key={decade} decade={decade} result={result} onSelect={onImageSelect} />;
        })}
      </div>
    </section>
  );
};
