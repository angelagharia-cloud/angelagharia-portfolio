interface ScrollableImageProps {
  src: string;
  alt: string;
  caption?: string;
  maxHeight?: string;
  className?: string;
}

export function ScrollableImage({ 
  src, 
  alt, 
  caption, 
  maxHeight = '600px',
  className = '' 
}: ScrollableImageProps) {
  return (
    <div className="space-y-3">
      <div 
        className={`w-full overflow-y-auto rounded-lg shadow-lg border border-neutral-200 ${className}`}
        style={{ maxHeight }}
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full"
        />
      </div>
      {caption && (
        <p className="text-sm text-neutral-600 text-center">{caption}</p>
      )}
    </div>
  );
}
