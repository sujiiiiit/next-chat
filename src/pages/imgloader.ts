import { useEffect } from 'react';

type EmojiConfig = {
  url: string; // URL of the emoji image
  name: string; // Alt text for the image
  containerClasses?: string; // Optional additional classes for container
};

function createEmojiImage(config: EmojiConfig): HTMLElement {
  const { url, name, containerClasses } = config;

  // Create a container for the image and background
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "34px";
  container.style.height = "34px";
  container.style.display = "inline-block";
  if (containerClasses) {
    container.className = containerClasses;
  }

  // Create the emoji image
  const img = document.createElement("img");
  img.src = url;
  img.alt = name;
  img.width = 34;
  img.height = 34;
  img.className =
    "w-[34px] h-[34px] layer-transition opacity-100 aspect-square";
  img.loading = "lazy";

  // Add load event listener to handle image state changes
  img.addEventListener("load", () => {
    background.style.opacity = "0"; // Hide background on load
  });

  // Create the background element
  const background = document.createElement("span");
  background.style.position = "absolute";
  background.style.width = "34px";
  background.style.height = "34px";
  background.style.borderRadius = "50%";
  background.style.background = "rgba(112,117,121,0.08)";
  background.className = "aspect-square";

  // Append elements to container
  container.appendChild(img);
  container.appendChild(background);

  return container;
}

const EmojiComponent = () => {
  useEffect(() => {
    const emojiContainer = createEmojiImage({
      url: "https://example.com/emoji.png",
      name: "smile",
    });
    document.body.appendChild(emojiContainer);
  }, []); // Empty dependency array ensures this runs only once after the initial render

  return null; // No need to render anything from this component
};

export default EmojiComponent;