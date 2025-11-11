
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);

        const img = new Image();
        img.onload = () => {
          onImageUpload({
            dataUrl,
            mimeType: file.type,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }, [onImageUpload]);

  return (
    <div className="bg-white/10 backdrop-blur rounded-3xl p-6 space-y-5 border border-white/10">
      <h2 className="text-xl font-semibold text-white">1. Upload portrait</h2>
      <label className="block border border-dashed border-fuchsia-400/60 rounded-2xl p-6 text-center cursor-pointer hover:border-fuchsia-300 transition">
        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleImageChange} />
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-500/20">
            <UploadIcon />
          </div>
          <div>
            <p className="font-semibold text-lg">Drop or browse your portrait</p>
            <p className="text-sm text-slate-300">JPG or PNG · Keep the subject centred for best results</p>
          </div>
        </div>
      </label>
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950/30">
        {preview ? (
          <img src={preview} alt="Uploaded portrait preview" className="w-full aspect-square object-cover" />
        ) : (
          <div className="aspect-square flex items-center justify-center text-slate-500">
            Portrait preview appears here
          </div>
        )}
      </div>
    </div>
  );
};
