import { useEffect, useRef, useState } from "react";

export const useContentEditable = () => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const checkContent = () => {
      if (contentEditableRef.current) {
        const content = contentEditableRef.current.innerHTML.trim();
        setHasContent(content !== "" && content !== "<br>");
      }
    };

    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      contentEditableElement.addEventListener("input", checkContent);
      contentEditableElement.addEventListener("DOMSubtreeModified", checkContent);
    }

    return () => {
      if (contentEditableElement) {
        contentEditableElement.removeEventListener("input", checkContent);
        contentEditableElement.removeEventListener("DOMSubtreeModified", checkContent);
      }
    };
  }, []);

  return { contentEditableRef, hasContent };
};
