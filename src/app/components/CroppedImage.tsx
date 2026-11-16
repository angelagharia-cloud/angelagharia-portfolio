import { useEffect, useRef, useState } from 'react';

interface CroppedImageProps {
  src: string;
  startPercent?: number;
  endPercent?: number;
  alt: string;
  caption?: string;
  className?: string;
}

export function CroppedImage({ src, startPercent = 0, endPercent = 100, alt, caption, className = '' }: CroppedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate crop dimensions
      const startY = (startPercent / 100) * img.height;
      const endY = (endPercent / 100) * img.height;
      const cropHeight = endY - startY;
      const cropWidth = img.width;

      // Set canvas size to match cropped region
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped portion
      ctx.drawImage(
        img,
        0, startY,           // Source x, y
        cropWidth, cropHeight, // Source width, height
        0, 0,                // Destination x, y
        cropWidth, cropHeight  // Destination width, height
      );

      // Get the cropped image as data URL
      const dataUrl = canvas.toDataURL('image/png');
      setCroppedDataUrl(dataUrl);
      setIsLoading(false);
    };

    img.src = src;
  }, [src, startPercent, endPercent]);

  return (
    <div className="space-y-3">
      {isLoading && (
        <div className="w-full h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading...</div>
        </div>
      )}
      
      {croppedDataUrl && (
        <>
          {caption && (
            <p className="text-sm text-neutral-600 text-center">{caption}</p>
          )}
        </>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}