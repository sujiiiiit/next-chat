import { useEffect } from "react";

export function categoryNameFromDom($category: Element | null): string | null {
  return $category?.getAttribute("data-name") ?? null;
}

export function useActiveCategoryScrollDetection(
  BodyRef: React.RefObject<HTMLDivElement | null>,
  setActiveCategory: (category: string) => void
) {
  useEffect(() => {
    const visibleCategories = new Map<string, number>();
    const bodyRef = BodyRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!bodyRef) {
          return;
        }

        for (const entry of entries) {
          const id = categoryNameFromDom(entry.target);
          if (id) {
            visibleCategories.set(id, entry.intersectionRatio);
          }
        }

        const sortedCategories = Array.from(visibleCategories.entries()).sort(
          (a, b) => b[1] - a[1]
        );

        if (sortedCategories.length > 0) {
          setActiveCategory(sortedCategories[0][0]);
        }
      },
      {
        threshold: [0, 1],
        rootMargin: "0px",
      }
    );

    bodyRef?.querySelectorAll(".emoji-category").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [BodyRef, setActiveCategory]);
}