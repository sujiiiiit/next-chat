import { useEffect, useState } from "react";

// functions.ts
export const scrollToCenter = (containerRef: React.RefObject<HTMLDivElement | null>, element: HTMLElement) => {
  if (containerRef.current) {
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const offset = elementRect.left - containerRect.left + elementRect.width / 2 - containerRect.width / 2;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }
};

export function useScrollAmount(ref: React.RefObject<HTMLDivElement | null>) {
  const [scroll, setScroll] = useState({ scrollTop: 0, scrollLeft: 0 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateScroll = () => {
      setScroll({
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft,
      });
      setIsScrolled(element.scrollTop !== 0 || element.scrollLeft !== 0);
    };

    element.addEventListener("scroll", updateScroll);
    updateScroll(); // Initial update

    return () => {
      element.removeEventListener("scroll", updateScroll);
    };
  }, [ref]);

  return { scroll, isScrolled };
}
