import { cn } from '@/lib/utils';

import OptimizedImage from './OptimizedImage';

interface ProductImageGalleryProperties {
  images: ImageFields[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProperties) => {
  if (!images || images.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <div className="grid grid-cols-2 gap-2 overflow-auto">
          <OptimizedImage
            src=""
            alt="No product images available"
            width={800}
            height={800}
            className="col-span-2 rounded-md border-2 border-primary aspect-square"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-1">
      <div className="grid grid-cols-2 gap-2 overflow-auto">
        {images.map((image, index) => (
          <OptimizedImage
            key={index}
            src={index === 0 ? image.src : image.large || image.src}
            alt={image.altText || `Product image ${index + 1}`}
            width={image.width || 800}
            height={image.height || 800}
            blurDataURL={image.blurDataURL}
            priority={index === 0}
            quality={85}
            sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
            className={cn(
              'rounded-md border-2 object-cover aspect-square',
              index === 0 ? 'border-primary col-span-2' : 'border-transparent',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
