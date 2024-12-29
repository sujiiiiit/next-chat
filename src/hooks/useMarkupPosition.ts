import { useState, useRef, useEffect } from "react";
import clamp from "lodash/clamp";
import getVisibleRect from "@/lib/getVisibleRect";

export function useSelectionPosition() {
  const selectionRef = useRef<HTMLDivElement | null>(null);
  const markupContainerRef = useRef<HTMLDivElement | null>(null);
  interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  const [selectionPosition, setSelectionPosition] = useState<Position | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const element = selectionRef.current;
      const markupElement = markupContainerRef.current;
      if (!element || !markupElement) return;

      const selection = document.getSelection();
      
      // Ensure there's a selection and it's not collapsed (i.e., text is highlighted)
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const rowsWrapper = selectionRef.current;
      const sizesRect = markupElement?.getBoundingClientRect();
      if (!sizesRect) return;

      // Calculate position adjustments
      const visibleRect = markupElement && element
        ? getVisibleRect(markupElement, element, false, rect)
        : null;

      const { newHeight = 0, oldHeight = newHeight } = element as { newHeight?: number; oldHeight?: number };

      if (!visibleRect) {
        // Can happen when modifying a quote not in the visible area
        return;
      }

      if (!rowsWrapper) return;

      const selectionTop =
        (visibleRect ? visibleRect.rect.top : rowsWrapper.getBoundingClientRect().top) +
        bodyRect.top * -1;

      const top = selectionTop - sizesRect.height - 8 + (true ? oldHeight - newHeight : 0);

      // Calculate the left position based on the selection
      const minX = rowsWrapper.getBoundingClientRect().left;
      const maxX =
        rowsWrapper.getBoundingClientRect().left +
        rowsWrapper.getBoundingClientRect().width -
        Math.min(rowsWrapper.getBoundingClientRect().width, sizesRect.width);

      // Update the left position based on the selected range
      const left = clamp(
        rect.left + (rect.width - sizesRect.width) / 2, // Center the tooltip over the selection
        minX,
        maxX
      );

      // Update position of the container
      setSelectionPosition({
        top,
        left,
        width: sizesRect.width,
        height: sizesRect.height,
      });

      console.log({
        top,
        left,
        width: sizesRect.width,
        height: sizesRect.height,
      });
    };

    // Listen for selection changes (text selection event)
    if (typeof document !== "undefined") {
      document.addEventListener("selectionchange", handleSelection);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("selectionchange", handleSelection);
      }
    };
  }, []);

  return { selectionRef, markupContainerRef, selectionPosition };
}
