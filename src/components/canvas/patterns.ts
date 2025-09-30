export type PatternKind = "dots" | "sparkle" | "grid";

export type PatternOptions = {
  type: PatternKind;
  patternColor: string;
  size: number;
};

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

export function getPatternImage({
  type,
  patternColor,
  size,
}: PatternOptions): string {
  const safeSize = Math.max(4, size || 16);

  if (type === "dots") {
    const radius = Math.max(1, safeSize / 6);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${safeSize}' height='${safeSize}' viewBox='0 0 ${safeSize} ${safeSize}'><circle cx='${
      safeSize / 2
    }' cy='${safeSize / 2}' r='${radius}' fill='${patternColor}' /></svg>`;
    return svgUrl(svg);
  }

  if (type === "sparkle") {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${safeSize}' height='${safeSize}' viewBox='0 0 ${safeSize} ${safeSize}'><path d='M${
      safeSize / 2
    } 0 L${(safeSize * 3) / 8} ${(safeSize * 3) / 8} L0 ${safeSize / 2} L${
      (safeSize * 3) / 8
    } ${(safeSize * 5) / 8} L${safeSize / 2} ${safeSize} L${
      (safeSize * 5) / 8
    } ${(safeSize * 5) / 8} L${safeSize} ${safeSize / 2} L${
      (safeSize * 5) / 8
    } ${(safeSize * 3) / 8} Z' fill='${patternColor}' /></svg>`;
    return svgUrl(svg);
  }

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${safeSize}' height='${safeSize}' viewBox='0 0 ${safeSize} ${safeSize}' shape-rendering='crispEdges'><rect x='0' y='0' width='${safeSize}' height='1' fill='${patternColor}' /><rect x='0' y='0' width='1' height='${safeSize}' fill='${patternColor}' /></svg>`;
  return svgUrl(svg);
}
