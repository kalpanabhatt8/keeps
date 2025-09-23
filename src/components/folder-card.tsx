import React from "react";
import clsx from "clsx";

type FolderVariant = "neutral" | "kawaii" | "retro";

type FolderCardProps = {
  variant?: FolderVariant;
  showInsert?: boolean;
  showPlus?: boolean;
  label?: string;
  className?: string;
};

export function FolderCard({
  variant = "neutral",
  showInsert = true,
  showPlus = false,
  label = "KEEPS",
  className,
}: FolderCardProps) {
  return (
    <div className={clsx("folder-shell", className)} data-variant={variant}>
      {showInsert && (
        <>
          <div className="folder-insert back" />
          <div className="folder-insert front" />
        </>
      )}
      {showPlus && <span className="folder-plus">+</span>}
      {label ? <span className="folder-label">{label}</span> : null}
    </div>
  );
}
