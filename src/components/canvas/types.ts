export type ElementKind = "text" | "image";

export type BoardElementBase = {
  id: string;
  kind: ElementKind;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  z: number;
};

export type TextElement = BoardElementBase & {
  kind: "text";
  text: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
  fontFamily?: string;
  weight?: number;
};

export type ImageElement = BoardElementBase & {
  kind: "image";
  src: string;
  naturalW?: number;
  naturalH?: number;
};

export type BoardElement = TextElement | ImageElement;

export type BackgroundMode =
  | { type: "solid"; bgColor: string }
  | {
      type: "pattern";
      pattern: "dots" | "sparkle" | "grid";
      bgColor: string;
      patternColor: string;
      size: number;
    };

export type BoardState = {
  background: BackgroundMode;
  elements: BoardElement[];
  selectedId?: string | null;
};
