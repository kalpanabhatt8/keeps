export type CanvasElementType = "text" | "sticker";

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  text?: string;
  fontSize?: number;
  color?: string;
  src?: string;
};

export type BackgroundState = {
  type: "color" | "image";
  value: string;
};
