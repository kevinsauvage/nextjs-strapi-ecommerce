import Image from 'next/image';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';

const EmptyState = ({
  children,
  image = NotFoundIllustration,
  title,
  subtitle,
  altText,
}: {
  children?: React.ReactNode;
  image?: {
    src: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle: string;
  altText: string;
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <Image
      className="w-full h-full max-h-[200px] object-contain mb-4"
      alt={altText}
      src={image.src}
      width={image.width}
      height={image.height}
    />
    <h4 className="font-bold font-heading mb-4">{title}</h4>
    <p className="max-w-2xs text-center">{subtitle}</p>
    {children}
  </div>
);

export default EmptyState;
