import { useEffect, useRef, useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface Asset {
  id: string;
  project: string;
  projectLabel: string;
  type: string;
  description: string;
  src: string;
  segment: string;
  cropData: {
    startPercent: number;
    endPercent: number;
  };
}

interface CroppedAssetProps {
  asset: Asset;
}

export function CroppedAsset({ asset }: CroppedAssetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
      const startY = (asset.cropData.startPercent / 100) * img.height;
      const endY = (asset.cropData.endPercent / 100) * img.height;
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
      setDimensions({ width: cropWidth, height: cropHeight });
      setIsLoading(false);
    };

    img.src = asset.src;
  }, [asset]);

  const downloadImage = () => {
    if (!croppedDataUrl) return;

    const link = document.createElement('a');
    link.download = `${asset.project}_${asset.segment}.png`;
    link.href = croppedDataUrl;
    link.click();
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-400 transition-colors">
      {/* Cropped Image Display */}
      <div className="relative bg-neutral-50 flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="animate-pulse text-neutral-400">Processing...</div>
          </div>
        )}
        
        {croppedDataUrl && (
          <img
            src={croppedDataUrl}
            alt={asset.description}
            className="w-full h-auto"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
          />
        )}

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Segment Label */}
        <div className="absolute top-3 left-3 bg-neutral-900/90 text-white px-3 py-1.5 rounded text-xs backdrop-blur-sm">
          {asset.segment}
        </div>
      </div>

      {/* Metadata & Actions */}
      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
              {asset.type}
            </span>
          </div>
          <p className="text-neutral-900">{asset.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={downloadImage}
            disabled={!croppedDataUrl}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>
          <button
            onClick={() => window.open(croppedDataUrl, '_blank')}
            disabled={!croppedDataUrl}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}