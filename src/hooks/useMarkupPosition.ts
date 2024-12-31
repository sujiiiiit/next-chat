import { useState, useRef, useEffect } from "react";
import clamp from "lodash/clamp";
import getVisibleRect from "@/lib/getVisibleRect";

export const useInputHandler = () => {
  const [linkContent, setLinkContent] = useState("");
  const [isLink, setIsLink] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkContent(event.target.value);
  };

  const toggleMarkupLink = () => {
    setIsLink((prevState) => !prevState);
  };

  return { linkContent, handleInputChange, isLink, toggleMarkupLink };
};

export function useSelectionPosition() {
  const selectionRef = useRef<HTMLDivElement | null>(null);
  const markupContainerRef = useRef<HTMLDivElement | null>(null);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectionPosition, setSelectionPosition] = useState<Position | null>(null);
  const [isInteractingWithMarkup, setIsInteractingWithMarkup] = useState(false); // Track interaction with markup
  const [isInputFocused, setIsInputFocused] = useState(false); // Track if input is focused

  interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  const updateSelectionPosition = () => {
    const element = selectionRef.current;
    const markupElement = markupContainerRef.current;
  
    if (!element || !markupElement) return;
  
    const selection = document.getSelection();
  
    // Check if there is an active selection
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const sizesRect = markupElement.getBoundingClientRect();
  
      if (!sizesRect) return;
  
      // Get the visible rectangle for the selection (you already have this logic)
      const visibleRect = getVisibleRect(markupElement, element, false, rect);
  
      if (!visibleRect) {
        return;
      }
  
      const selectionTop =
        (visibleRect ? visibleRect.rect.top : element.getBoundingClientRect().top) +
        bodyRect.top * -1;
  
      const top = selectionTop - sizesRect.height - 8;
  
      const minX = element.getBoundingClientRect().left;
      const maxX =
        element.getBoundingClientRect().left +
        element.getBoundingClientRect().width -
        sizesRect.width;
  
      const left = clamp(
        rect.left + (rect.width - sizesRect.width) / 2, // Center the tooltip over the selection
        minX,
        maxX
      );
  
      setSelectionPosition({
        top,
        left,
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      });
  
      // Set isSelected to true only if the selection is inside the selectionRef element
      if (element.contains(selection.anchorNode)) {
        setIsSelected(true); // Only set isSelected to true if selection is inside the element
      } else {
        setIsSelected(false); // Reset isSelected if selection is outside the element
      }
    } else {
      // If no selection or selection is collapsed, reset isSelected to false
      if (!isInteractingWithMarkup) {
        setIsSelected(false); // Do not reset selection if interacting with markup
      }
    }
  };
  
  useEffect(() => {
    const handleSelection = () => {
      updateSelectionPosition();
      
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (
        markupContainerRef.current &&
        markupContainerRef.current.contains(event.target as Node)
      ) {
        setIsInteractingWithMarkup(true); // User interacting with markup
      }
    };

    const handleMouseUp = () => {
      if (!isInputFocused) {
        setIsInteractingWithMarkup(false); // Reset if not interacting with markup
      }
    };

    const handleInputFocus = () => {
      setIsInputFocused(true); // Input focused
    };

    const handleInputBlur = () => {
      setIsInputFocused(false); // Input blurred
    };

    const preventContextMenu = (event: MouseEvent) => {
      if (selectionRef.current?.contains(event.target as Node)) {
        event.preventDefault(); // Prevent native context menu on selection
      }
    };

    // Listen for selection changes and other events
    if (typeof document !== "undefined") {
      document.addEventListener("selectionchange", handleSelection);
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("contextmenu", preventContextMenu); // Prevent context menu

      const inputElements = markupContainerRef.current?.querySelectorAll(
        "input, textarea, select"
      );
      inputElements?.forEach((input) => {
        input.addEventListener("focus", handleInputFocus);
        input.addEventListener("blur", handleInputBlur);
      });
    }

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("contextmenu", preventContextMenu); // Clean up context menu listener

      const inputElements = markupContainerRef.current?.querySelectorAll(
        "input, textarea, select"
      );
      inputElements?.forEach((input) => {
        input.removeEventListener("focus", handleInputFocus);
        input.removeEventListener("blur", handleInputBlur);
      });
    };
  }, [isInputFocused, isInteractingWithMarkup]);

  return { selectionRef, markupContainerRef, selectionPosition, isSelected };
}
