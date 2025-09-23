import React, { useId } from "react";
import clsx from "clsx";

const THEMES = {
  neutral: {
    top: "#2D223E",
    topEdge: "#3A2E50",
    bodyStart: "#F8F8FC",
    bodyEnd: "#DFDFE7",
    insertLight: "#FFFFFF",
    insertDark: "#D7D4DE",
    label: "#9B96A8",
    plus: "#D8D4E6",
  },
  kawaii: {
    top: "#5C4364",
    topEdge: "#6F4E78",
    bodyStart: "#FFF7FC",
    bodyEnd: "#F7E5F1",
    insertLight: "#FFFFFF",
    insertDark: "#F7D5E8",
    label: "#B27AA6",
    plus: "#F3BDD7",
  },
  retro: {
    top: "#4A2C25",
    topEdge: "#5A372F",
    bodyStart: "#FFF3DF",
    bodyEnd: "#F2DDC1",
    insertLight: "#FFFFFF",
    insertDark: "#F4CDA4",
    label: "#A27F61",
    plus: "#E3B487",
  },
} as const;

type FolderVariant = keyof typeof THEMES;

type FolderIllustrationProps = {
  variant?: FolderVariant;
  showInsert?: boolean;
  showPlus?: boolean;
  label?: string;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export function FolderIllustration({
  variant = "neutral",
  showInsert = true,
  showPlus = false,
  label = "KEEPS",
  className,
  ...svgProps
}: FolderIllustrationProps) {
  const id = useId();
  const theme = THEMES[variant];

  const bodyGradientId = `${id}-body`; // unique per instance

  return (
    <svg
      viewBox="0 0 320 260"
      role="img"
      aria-hidden
      className={clsx("h-auto w-full", className)}
      {...svgProps}
    >
      <defs>
        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.bodyStart} />
          <stop offset="100%" stopColor={theme.bodyEnd} />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor={theme.top} floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#${id}-shadow)`}>
        {/* Top flap */}
        <path
          d="M20 0h118c7.2 0 13.9 3.4 18.1 9.2l6.4 8.8H300c11 0 20 9 20 20v68H0V28C0 12.5 12.5 0 28 0Z"
          fill={theme.top}
          stroke={theme.topEdge}
          strokeWidth={2}
        />

        {/* Lower pocket */}
        <path
          d="M0 70h320v144c0 25.4-20.6 46-46 46H46c-25.4 0-46-20.6-46-46V70Z"
          fill={`url(#${bodyGradientId})`}
        />

        {/* Pocket highlight */}
        <path
          d="M12 86c0-9.4 7.6-17 17-17h219c4.9 0 9.6 2.1 12.9 5.7l7.8 8.3c3.2 3.4 7.7 5.3 12.4 5.3H320v126c0 18.2-14.8 33-33 33H33c-18.2 0-33-14.8-33-33V86Z"
          fill="rgba(255,255,255,0.34)"
        />

        {showInsert && (
          <>
            <rect
              x="48"
              y="36"
              width="96"
              height="116"
              rx="18"
              fill={theme.insertDark}
              transform="rotate(-6 48 36)"
            />
            <rect
              x="78"
              y="28"
              width="110"
              height="132"
              rx="20"
              fill={theme.insertLight}
              transform="rotate(6 78 28)"
            />
          </>
        )}

        {showPlus && (
          <g transform="translate(40 32)" stroke={theme.plus} strokeWidth={6} strokeLinecap="round">
            <line x1="0" y1="0" x2="0" y2="28" />
            <line x1="-14" y1="14" x2="14" y2="14" />
          </g>
        )}

        <text
          x="236"
          y="186"
          fontFamily="var(--font-manrope, 'Manrope', 'sans-serif')"
          fontSize="20"
          letterSpacing="4"
          fill={theme.label}
        >
          {label.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

export type { FolderVariant };
