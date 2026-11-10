import React, { useState } from 'react';
import { Box } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[4/3]',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`${aspectRatioClass} w-full bg-stone-100 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        <Box className="w-8 h-8 text-stone-400 mb-2 stroke-[1.5]" />
        <span className="text-xs font-medium text-stone-600 line-clamp-2 max-w-[200px]">
          {alt}
        </span>
        <span className="text-[11px] font-mono text-stone-400 mt-1">
          Kurokawa Studio Archive
        </span>
      </div>
    );
  }

  return (
    <div className={`${aspectRatioClass} w-full overflow-hidden bg-stone-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
};
