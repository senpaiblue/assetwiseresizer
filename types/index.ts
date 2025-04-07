// types/index.ts
export interface Platform {
    id: string;
    name: string;
    aspectRatios: AspectRatio[];
    icon: string;
  }
  
  export interface AspectRatio {
    name: string;
    width: number;
    height: number;
    ratio: string;
    maxFileSize: string;
  }
  
  export interface ConvertedImage {
    platformId: string;
    aspectRatioName: string;
    dataUrl: string;
    width: number;
    height: number;
  }