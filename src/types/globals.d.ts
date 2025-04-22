export {}; // 👈 IMPORTANT to make this file a module

declare global {
  type BannerHomeType = {
    image: {
      url: string;
      alt: string;
    };
    items: {
      handle: string;
      upTitle: string;
      title: string;
      description: string;
    }[];
    style?: {
      [key: string]: unknown;
    };
  };

  type BannerHomeCategories = {
    title: string;
    handle: string;
    image: {
      url: string;
      alt: string;
    };
  };

  export interface ImageFields {
    src: string;
    altText?: string | null;
    small: string;
    medium: string;
    large: string;
    blurDataURL: string;
    width?: number | null;
    height?: number | null;
  }
}
