export function useScrollCategoryIntoView() {
    return function scrollCategoryIntoView(category: string): void {
      const categoryElement = document.querySelector(`[data-category="${category}"]`);
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }