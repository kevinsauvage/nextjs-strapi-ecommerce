import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ProductImageGalleryProperties {
  images: ImageFields[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProperties) => {
  return (
    <div className="grid gap-4 md:grid-cols-1">
      <div className="grid grid-cols-2 gap-2 overflow-auto">
        {images.map((image, index) => (
          <Image
            className={cn(
              'relative flex w-full rounded-md overflow-hidden border-2 object-cover aspect-square h-full w-ful',
              index === 0 ? 'border-primary col-span-2' : 'border-transparent',
            )}
            key={index}
            src={index === 0 ? image.src : image.large || '/placeholder.svg'}
            alt={image.altText}
            placeholder="blur"
            width={100}
            height={100}
            quality={100}
            blurDataURL={image.blurDataURL}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
