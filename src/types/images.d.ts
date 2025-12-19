export {};

type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

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

declare module '*.webp' {
  const content: StaticImageData;
  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
