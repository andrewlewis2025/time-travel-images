
import { useRef, useEffect, useState, useCallback } from 'react';
import type { UploadedImage } from '../types';

export const useMaskCanvas = (
  uploadedImage: UploadedImage | null,
  onMaskUpdate: (maskDataUrl: string) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const [brushColor, setBrushColor] = useState('white');
  const [brushSize, setBrushSize] = useState(30);

  const getCanvasPoint = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    return {
      x: (clientX - rect.left) / rect.width * canvas.width,
      y: (clientY - rect.top) / rect.height * canvas.height,
    };
  };
  
  const updateMaskCallback = useCallback(() => {
    if (canvasRef.current) {
      onMaskUpdate(canvasRef.current.toDataURL('image/png'));
    }
  }, [onMaskUpdate]);

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    isDrawing.current = true;
    lastPoint.current = getCanvasPoint(event);
    if(lastPoint.current) {
        drawLine(lastPoint.current, lastPoint.current); // Draw a dot
    }
    if (event.cancelable) event.preventDefault();
  }, [brushColor, brushSize]);

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;
    const point = getCanvasPoint(event);
    if (lastPoint.current && point) {
      drawLine(lastPoint.current, point);
    }
    lastPoint.current = point;
    if (event.cancelable) event.preventDefault();
  }, [brushColor, brushSize]);

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
    lastPoint.current = null;
    updateMaskCallback();
  }, [updateMaskCallback]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);
  
  const fillWhite = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
        clearCanvas();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateMaskCallback();
    }
  }, [clearCanvas, updateMaskCallback]);

  const autoMask = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        fillWhite(); // Start with a white background
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

        updateMaskCallback();
      }
  }, [fillWhite, updateMaskCallback]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && uploadedImage) {
      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;
      autoMask();
    } else if (canvas) {
        clearCanvas();
    }
  }, [uploadedImage, autoMask, clearCanvas]);

  return {
    canvasRef,
    brushColor,
    brushSize,
    setBrush: setBrushColor,
    setBrushSize,
    clearMask: fillWhite,
    autoMask,
    fillWhite,
  };
};
