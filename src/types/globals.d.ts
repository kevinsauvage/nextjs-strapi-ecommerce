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

declare module '*.png' {
  import type { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.jpg' {
  import type { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.jpeg' {
  import type { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  /**
   * Use `any` to avoid conflicts with
   * `@svgr/webpack` plugin or
   * `babel-plugin-inline-react-svg` plugin.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module '*.webp' {
  import type { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  import type { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}
