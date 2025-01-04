export type NullableElement = HTMLDivElement | null;
export function useScrollCategoryIntoView({
  BodyRef
}: {
  BodyRef: React.RefObject<HTMLDivElement | null>;
}): (category: string) => void {
  return function scrollCategoryIntoView(category: string): void {
    if (!BodyRef.current) {
      return;
    }
    const $category = BodyRef.current.querySelector(
      `[data-name="${category}"]`
    ) as NullableElement;

    if (!$category) {
      console.log(`Category element with data-name="${category}" not found`);
      return;
    }

    $category.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    
  };
}



