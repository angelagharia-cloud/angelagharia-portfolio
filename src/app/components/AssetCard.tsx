import { FileImage } from 'lucide-react';

interface Asset {
  id: string;
  project: string;
  projectLabel: string;
  type: string;
  description: string;
  src: string;
  segment: string;
  cropGuide: string;
}

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-400 transition-colors">
      {/* Image Preview with Crop Guide Overlay */}
      <div className="relative bg-neutral-100 aspect-[4/3] flex items-center justify-center overflow-hidden">
        <img
          src={asset.src}
          alt={asset.description}
          className="w-full h-full object-contain"
        />
        
        {/* Crop Guide Indicator */}
        <div className="absolute top-3 right-3 bg-neutral-900/80 text-white px-3 py-1.5 rounded text-xs backdrop-blur-sm">
          {asset.segment}
        </div>
      </div>

      {/* Metadata */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileImage className="w-4 h-4 text-neutral-400" />
              <span className="text-sm text-neutral-600">{asset.type}</span>
            </div>
            <p className="text-neutral-900">{asset.description}</p>
          </div>
        </div>

        {/* Processing Information */}
        <div className="pt-3 border-t border-neutral-200">
          <div className="text-sm space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-neutral-500 shrink-0">Segment:</span>
              <span className="text-neutral-700">{asset.cropGuide}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 pt-2">
          <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
            Ready for extraction
          </div>
        </div>
      </div>
    </div>
  );
}
