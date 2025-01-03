import { useEffect, useRef } from "react";

export function categoryNameFromDom($category: Element | null): string | null {
  return $category?.getAttribute("data-name") ?? null;
}

export function useActiveCategoryScrollDetection(
  BodyRef: React.RefObject<HTMLElement>,
  setActiveCategory: (category: string) => void
) {
  useEffect(() => {
    const visibleCategories = new Map();
    const bodyRef = BodyRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!bodyRef) {
          return;
        }

        for (const entry of entries) {
          const id = categoryNameFromDom(entry.target);
          visibleCategories.set(id, entry.intersectionRatio);
        }

        const ratios = Array.from(visibleCategories);
        const lastCategory = ratios[ratios.length - 1];

        if (lastCategory[1] === 1) {
          setActiveCategory(lastCategory[0]);
          // console.log("Active category:", lastCategory[0]);
          return;
        }

        for (const [id, ratio] of ratios) {
          if (ratio) {
            setActiveCategory(id);
            // console.log("Active category:", id);
            break;
          }
        }
      },
      {
        threshold: [0, 1],
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
