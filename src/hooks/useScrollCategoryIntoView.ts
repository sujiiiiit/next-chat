export type NullableElement = HTMLDivElement | null;
export function useScrollCategoryIntoView({
  BodyRef,
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

    // $category.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })

    const categoryTop = category=='frequentEmojis'?$category.offsetTop:$category.offsetTop+10;
    // console.log("categoryTop", categoryTop);
    BodyRef.current.scrollTo({ top: categoryTop, behavior: "smooth" });

    // BodyRef.current.scrollTo({ top: top, behavior: "smooth" });
  };
}
