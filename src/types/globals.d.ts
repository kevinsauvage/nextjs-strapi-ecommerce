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

// StaticImageData interface matching Next.js's type
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

declare module '*.png' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpg' {
  const content: StaticImageData;
  export default content;
}

declare module '*.jpeg' {
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
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;
  export default content;
}
