
import windowSize from './windowSize';

export default function getVisibleRect(
  element: HTMLElement,
  overflowElement: HTMLElement,
  lookForSticky?: boolean,
  rect: DOMRect = element.getBoundingClientRect(),
  overflowRect: DOMRect = overflowElement.getBoundingClientRect()
) {
  let {top:overflowTop} = overflowRect;
  const {right: overflowRight, bottom: overflowBottom, left: overflowLeft} = overflowRect;

  // * respect sticky headers
  if(lookForSticky) {
    const sticky = overflowElement.querySelector('.sticky');
    if(sticky) {
      const stickyRect = sticky.getBoundingClientRect();
      overflowTop = stickyRect.bottom;
    }
  }

  if(rect.top >= overflowBottom ||
    rect.bottom <= overflowTop ||
    rect.right <= overflowLeft ||
    rect.left >= overflowRight) {
    return null;
  }

  const overflow = {
    top: false,
    right: false,
    bottom: false,
    left: false,
    vertical: 0 as 0 | 1 | 2,
    horizontal: 0 as 0 | 1 | 2
  };

  const windowWidth = windowSize.width;
  const windowHeight = windowSize.height;

  return {
    rect: {
      top: rect.top < overflowTop && overflowTop !== 0 ? (overflow.top = true, ++overflow.vertical, overflowTop) : rect.top,
      right: rect.right > overflowRight && overflowRight !== windowWidth ? (overflow.right = true, ++overflow.horizontal, overflowRight) : rect.right,
      bottom: rect.bottom > overflowBottom && overflowBottom !== windowHeight ? (overflow.bottom = true, ++overflow.vertical, overflowBottom) : rect.bottom,
      left: rect.left < overflowLeft && overflowLeft !== 0 ? (overflow.left = true, ++overflow.horizontal, overflowLeft) : rect.left
    },
    overflow
  };
}
if (typeof window !== "undefined") {
  (window as typeof window & { getVisibleRect: typeof getVisibleRect }).getVisibleRect = getVisibleRect;
}
