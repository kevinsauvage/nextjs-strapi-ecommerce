'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import NotFoundIllustration from '@/assets/NotFoundIllustration.png';

type EmptyStateProps = {
  children?: React.ReactNode;
  image?: {
    src: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle: string;
  altText: string;
  tips?: string[];
  variant?: 'default' | 'cart' | 'search' | 'wishlist' | 'orders' | 'addresses' | 'error';
};

const EmptyState = ({
  children,
  image = NotFoundIllustration,
  title,
  subtitle,
  altText,
  tips,
  variant = 'default',
}: EmptyStateProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const contextualTips =
    tips ||
    (() => {
      switch (variant) {
        case 'cart':
          return [
            'Browse our featured collections',
            'Check out our bestsellers',
            'Use filters to find what you need',
          ];
        case 'search':
          return [
            'Try different keywords',
            'Check your spelling',
            'Use more general terms',
            'Browse categories instead',
          ];
        case 'wishlist':
          return [
            'Start adding items you love',
            'Save items for later purchase',
            'Share your wishlist with others',
          ];
        case 'orders':
          return [
            'Your order history will appear here',
            'Track shipments from your orders',
            'Reorder items you loved',
          ];
        case 'addresses':
          return [
            'Add addresses for faster checkout',
            'Set a default shipping address',
            'Manage multiple addresses',
          ];
        default:
          return [];
      }
    })();

  return (
    <div
      className={`flex flex-col items-center justify-center h-full transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`relative mb-6 transition-all duration-700 delay-150 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <Image
          className="w-full h-full max-h-[200px] object-contain animate-pulse-subtle"
          alt={altText}
          src={image.src}
          width={image.width}
          height={image.height}
        />
      </div>
      <div
        className={`text-center transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h4 className="text-heading-3 mb-2">{title}</h4>
        <p className="max-w-md text-center text-body text-secondary mb-6">{subtitle}</p>

        {contextualTips.length > 0 && (
          <div className="mb-6 max-w-md">
            <p className="text-label-sm text-secondary mb-3 font-medium">Helpful tips:</p>
            <ul className="space-y-2 text-left">
              {contextualTips.map((tip, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-2 text-body-sm text-secondary transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children && (
          <div
            className={`transition-all duration-500 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
