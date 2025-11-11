
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratorControls } from './components/GeneratorControls';
import { ResultsGallery } from './components/ResultsGallery';
import { HowItWorks } from './components/HowItWorks';
import { ImageModal } from './components/ImageModal';
import { decadeStyles, generateTimeTravelImage } from './services/geminiService';
import type { GeneratedImage, ProgressState, UploadedImage } from './types';
import JSZip from 'jszip';

const generateAutoMask = (image: UploadedImage): Promise<string> => {
  return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          // This should practically never happen in a modern browser
          return resolve('');
      }

      canvas.width = image.width;
      canvas.height = image.height;
      
      // Fill with white (editable area)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw black mask (locked area)
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'black';
      ctx.save();
      
      // Face oval
      const faceCx = w / 2;
      const faceCy = h / 2.8;
      ctx.translate(faceCx, faceCy);
      ctx.scale(w / 5, h / 4);
      ctx.beginPath();
      ctx.ellipse(0, 0, 1, 1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Body rectangle
      ctx.fillRect(w * 0.25, h * 0.45, w * 0.5, h * 0.55);
      
      resolve(canvas.toDataURL('image/png'));
  });
};


const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState<ProgressState>({
    isLoading: false,
    completed: 0,
    total: 0,
    label: '',
  });
  const [seed, setSeed] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleImageUpload = async (image: UploadedImage) => {
    setUploadedImage(image);
    setGeneratedImages([]); // Clear previous results
    setMaskDataUrl(null); // Clear old mask while new one generates

    const mask = await generateAutoMask(image);
    setMaskDataUrl(mask);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage || !maskDataUrl) {
      alert('Please upload an image and wait for the auto-mask to be ready.');
      return;
    }

    setProgress({ isLoading: true, completed: 0, total: Object.keys(decadeStyles).length, label: 'Initializing...' });
    setGeneratedImages([]); // Clear previous results for a new generation
    
    const base64Image = uploadedImage.dataUrl.split(',')[1];
    const base64Mask = maskDataUrl.split(',')[1];
    const numericSeed = seed === '' ? undefined : Number(seed);

    const decades = Object.keys(decadeStyles);
    let completedCount = 0;

    const results: GeneratedImage[] = [];

    const tasks = decades.map(async (decade) => {
      try {
        setProgress(prev => ({ ...prev, label: `Generating ${decade}...` }));
        const imageUrl = await generateTimeTravelImage(
          base64Image,
          base64Mask,
          uploadedImage.mimeType,
          decade
        );
        completedCount++;
        setProgress(prev => ({ ...prev, completed: completedCount, label: `Generated ${decade}!` }));
        results.push({ decade, imageUrl, status: 'success' });
      } catch (error) {
        console.error(`Failed to generate for ${decade}:`, error);
        completedCount++;
        setProgress(prev => ({ ...prev, completed: completedCount, label: `Error on ${decade}` }));
        results.push({ decade, imageUrl: null, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }
      setGeneratedImages([...results].sort((a, b) => decades.indexOf(a.decade) - decades.indexOf(b.decade)));
    });

    await Promise.all(tasks);

    setProgress(prev => ({ ...prev, isLoading: false, label: 'Generation complete!' }));
  }, [uploadedImage, maskDataUrl, seed]);

  const handleDownloadAll = async () => {
    const successfulImages = generatedImages.filter(img => img.status === 'success' && img.imageUrl);
    if (successfulImages.length === 0) {
      alert('No successful images to download.');
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder('time-travel-photos');
    if (!folder) return;

    await Promise.all(successfulImages.map(async (result) => {
        if (result.imageUrl) {
            const response = await fetch(result.imageUrl);
            const blob = await response.blob();
            folder.file(`${result.decade}.png`, blob);
        }
    }));

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'time-travel-photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <Header />
      <main id="workspace" className="space-y-8">
        <section className="max-w-xl mx-auto">
          <ImageUploader onImageUpload={handleImageUpload} />
        </section>
        <GeneratorControls 
            onGenerate={handleGenerate} 
            progress={progress}
            isGenerationDisabled={!uploadedImage || !maskDataUrl}
            seed={seed}
            onSeedChange={setSeed}
        />
        <ResultsGallery 
            generatedImages={generatedImages} 
            onDownloadAll={handleDownloadAll}
            onImageSelect={setSelectedImage}
        />
        <HowItWorks />
      </main>
      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default App;
