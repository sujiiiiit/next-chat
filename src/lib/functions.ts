import { useEffect, useState } from "react";

export function scrollToCenter(
  containerRef: React.RefObject<HTMLDivElement | null>,
  clickedElement: HTMLElement
) {
  if (!containerRef.current || !clickedElement) return;

  const container = containerRef.current;
  const containerWidth = container.offsetWidth;
  const containerScrollLeft = container.scrollLeft;

  // Get the clicked element's position relative to the container
  const elementRect = clickedElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Calculate the element's position relative to the container
  const elementCenter = elementRect.left + elementRect.width / 2;
  const containerCenter = containerRect.left + containerWidth / 2;

  // Calculate the scroll position needed to center the element
  const scrollTo = elementCenter - containerCenter + containerScrollLeft;

  // Scroll the container to center the element
  container.scrollTo({
    left: scrollTo,
    behavior: "smooth",
  });
}

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
