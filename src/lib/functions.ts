
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


