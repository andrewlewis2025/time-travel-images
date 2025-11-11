
import React, { useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, CloseIcon } from './icons';

interface ImageModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (!image?.imageUrl) return;
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `${image.decade}-look.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div
        className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 md:p-6 w-full max-w-3xl max-h-full flex flex-col gap-4 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex items-center justify-between">
            <h2 id="image-modal-title" className="text-2xl font-bold text-white">{image.decade}</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition" aria-label="Close modal">
                <CloseIcon />
            </button>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
            {image.imageUrl && (
                <img src={image.imageUrl} alt={`Generated look for ${image.decade}`} className="max-w-full max-h-[75vh] object-contain rounded-xl"/>
            )}
        </div>
        <div className="flex justify-end">
            <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-slate-900 transition">
                <DownloadIcon />
                <span>Download</span>
            </button>
        </div>
      </div>
    </div>
  );
};
