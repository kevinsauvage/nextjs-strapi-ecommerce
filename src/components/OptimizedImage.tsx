'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './ui/skeleton';

type OptimizedImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  onError?: () => void;
  fallbackSrc?: string;
};

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
  priority = false,
  className,
  sizes,
  quality = 85,
  fill = false,
  onError,
  fallbackSrc = PLACEHOLDER_IMAGE,
}: OptimizedImageProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.();
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  // Generate responsive sizes if not provided
  const responsiveSizes =
    sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw';

  // Default dimensions for aspect ratio if not provided
  const defaultWidth = width || 800;
  const defaultHeight = height || 800;

  const containerClassName = fill
    ? cn('relative overflow-hidden', className)
    : cn('relative overflow-hidden', className);

  return (
    <div className={containerClassName}>
      {imageLoading && !imageError && <Skeleton className="absolute inset-0 z-10" />}
      {blurDataURL && imageLoading && !imageError && (
        <Image
          src={blurDataURL}
          alt=""
          fill
          width={undefined}
          height={undefined}
          className="absolute inset-0 z-0 object-cover blur-xl scale-110"
          aria-hidden="true"
          unoptimized
        />
      )}
      <Image
        src={imageError ? fallbackSrc : currentSrc}
        alt={alt}
        width={fill ? undefined : defaultWidth}
        height={fill ? undefined : defaultHeight}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={responsiveSizes}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className={cn(
          'transition-opacity duration-300 object-cover',
          imageLoading && !imageError ? 'opacity-0' : 'opacity-100',
          fill ? 'w-full h-full' : '',
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  );
};

export default OptimizedImage;
