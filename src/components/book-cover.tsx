import React from "react";
import Image from "next/image";
import clsx from "clsx";

type BookCoverVariant = "solid" | "grid" | "abstract" | "strap" | "gradient";

type BookCoverBaseProps = {
  variant?: BookCoverVariant;
  title: string;
  subtitle?: string;
  coverImageUrl?: string | null;
  titleColor?: string;
  subtitleColor?: string;
  className?: string;
};

type BookCoverProps = BookCoverBaseProps & React.ComponentPropsWithoutRef<"div">;

export function BookCover({
  variant = "solid",
  title,
  subtitle,
  coverImageUrl,
  titleColor,
  subtitleColor,
  className,
  style,
  ...rest
}: BookCoverProps) {
  return (
    <div className={clsx("book-cover-stack", className)} {...rest}>
      {/* <div className="book-cover-backplate" aria-hidden /> */}
      {/* <div className="book-cover-shadow" aria-hidden /> */}
      <div className="book-cover" data-variant={variant} style={style}>
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt="Cover artwork"
            fill
            className="cover-image"
            unoptimized
          />
        ) : null}
        <div className="book-cover__content">
          <h3 className="book-cover__title" style={titleColor ? { color: titleColor } : undefined}>
            {title}
          </h3>
          {subtitle ? (
            <p
              className="book-cover__subtitle"
              style={subtitleColor ? { color: subtitleColor } : undefined}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type { BookCoverVariant, BookCoverProps };
