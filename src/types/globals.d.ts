export {}; // 👈 IMPORTANT to make this file a module

declare global {
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
