import React, { useCallback } from "react";
import { Rnd } from "react-rnd";
import clsx from "clsx";
import { CanvasElement } from "./types";
import Image from "next/image";

type CanvasItemProps = {
  item: CanvasElement;
  selected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
};

function CanvasItem({ item, selected, onSelect, onChange, onDelete }: CanvasItemProps) {
  const handleDragStop = useCallback(
    (_: MouseEvent | TouchEvent, data: { x: number; y: number }) => {
      onChange(item.id, { x: data.x, y: data.y });
    },
    [item.id, onChange]
  );

  const handleResizeStop = useCallback(
    (
      _: MouseEvent | TouchEvent,
      __: unknown,
      ref: HTMLElement,
      ___: unknown,
      position: { x: number; y: number }
    ) => {
      onChange(item.id, {
        width: parseFloat(ref.style.width),
        height: parseFloat(ref.style.height),
        x: position.x,
        y: position.y,
      });
    },
    [item.id, onChange]
  );

  const handleTextBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      onChange(item.id, { text: event.currentTarget.textContent ?? "" });
    },
    [item.id, onChange]
  );

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDelete(item.id);
    },
    [item.id, onDelete]
  );

  return (
    <Rnd
      bounds="parent"
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onDragStart={() => onSelect(item.id)}
      onResizeStart={() => onSelect(item.id)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
      }}
      className={clsx(
        "group relative",
        selected ? "z-20" : "z-10"
      )}
      style={{ zIndex: item.zIndex }}
      enableResizing
    >
      <div
        className={clsx(
          "h-full w-full rounded-xl border transition",
          selected ? "border-border-emphasis shadow-lg" : "border-transparent shadow-sm"
        )}
        style={{
          transform: `rotate(${item.rotation}deg)`,
          transformOrigin: "center",
          backgroundColor: item.type === "text" ? "rgba(255,255,255,0.85)" : "transparent",
          padding: item.type === "text" ? "0.5rem" : 0,
        }}
      >
        {item.type === "text" ? (
          <div
            className="h-full w-full cursor-text overflow-hidden break-words text-left outline-none"
            contentEditable
            suppressContentEditableWarning
            spellCheck
            style={{
              fontSize: item.fontSize ?? 20,
              color: item.color ?? "#2E2A3F",
            }}
            onBlur={handleTextBlur}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {item.text}
          </div>
        ) : item.src ? (
          <div className="pointer-events-none relative h-full w-full">
            <Image
              src={item.src}
              alt="Sticker"
              fill
              className="object-contain"
              draggable={false}
              unoptimized
            />
          </div>
        ) : null}

        {selected ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-ink shadow-md"
            aria-label="Delete item"
          >
            ×
          </button>
        ) : null}
      </div>
    </Rnd>
  );
}

export default React.memo(CanvasItem);
