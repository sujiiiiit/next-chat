import { useState } from "react";

export const useInputHandler = () => {
  const [linkContent, setLinkContent] = useState("");
  const [isLink, setIsLink] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkContent(event.target.value);
  };

  const toggleMarkupLink = () => {
    setIsLink((prevState) => !prevState);
  };

  return { linkContent, handleInputChange, isLink, toggleMarkupLink };
};
