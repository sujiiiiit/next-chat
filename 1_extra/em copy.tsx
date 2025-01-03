import React, { useEffect, useState, useMemo, useCallback } from "react";
import emojiData from "@/assets/regularEmoji.json"; // Import your emoji data
import { useToast } from "@/hooks/use-toast"; // Import your custom toast hook
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"; // Import your context menu components
import { Icon } from "@/components/ui/icon"; // Import your icon component

// Memoize the emoji data for faster lookup
const emojiDataMap = emojiData.reduce((map, emoji) => {
  map[emoji.u] = emoji; // Map unified code to emoji data
  return map;
}, {} as { [key: string]: (typeof emojiData)[0] });

function App() {
  const { toast } = useToast();
  const [frequentEmojis, setFrequentEmojis] = useState<{
    [key: string]: number;
  }>({});
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Custom category mapping
  const customCategories = [
    { title: "Smileys & People", categories: [1] },
    { title: "Animals & Nature", categories: [2] },
    { title: "Food and Drinks", categories: [3] },
    { title: "Travel and Places", categories: [4] },
    { title: "Activities and Sports", categories: [5] },
    { title: "Object and Symbol", categories: [6] },
    { title: "Flags", categories: [7] },
  ];

  // Filter and sort emojis based on categories
  const filteredEmojis = useMemo(() => {
    return customCategories.map(({ title, categories }) => {
      const emojis = emojiData.filter((emoji) =>
        categories.includes(Number(emoji.c))
      );
      return {
        title,
        emojis: emojis.sort((a, b) => a.o - b.o),
      };
    });
  }, [customCategories]);

  // Get emoji image URL
  const getEmojiImageUrl = (emoji: { u: string }) => {
    return `/assets/img/apple/64/${emoji.u}.png`;
  };

  // Load frequent emojis from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("frequentEmojis");
    if (storedData) {
      setFrequentEmojis(JSON.parse(storedData));
    }
  }, []);

  // Save frequent emojis to localStorage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem("frequentEmojis", JSON.stringify(frequentEmojis));
    }, 1000);
    return () => clearTimeout(handler);
  }, [frequentEmojis]);

  // Handle emoji click
  const handleEmojiClick = useCallback(
    (emoji: { u: string; n: string }) => {
      toast({
        title: "Emoji Clicked",
        description: JSON.stringify(emoji, null, 2),
      });

      // Update the frequency count
      setFrequentEmojis((prev) => ({
        ...prev,
        [emoji.u]: (prev[emoji.u] || 0) + 1,
      }));
    },
    [toast]
  );

  // Handle copying the emoji
  const handleCopyEmoji = (emoji: { u: string; n: string }) => {
    navigator.clipboard.writeText(emoji.n);
    toast({
      title: "Emoji Copied",
      description: `Copied "${emoji.n}" to clipboard.`,
    });
  };

  // Handle removing the emoji from frequent list
  const handleRemoveEmoji = (emoji: { u: string }) => {
    setFrequentEmojis((prev) => {
      const updated = { ...prev };
      delete updated[emoji.u];
      return updated;
    });
    toast({
      title: "Emoji Removed",
      description: `Removed "${emoji.u}" from frequent list.`,
    });
  };

  // Handle image load event
  const handleImageLoad = (unified: string) => {
    setImageLoaded((prev) => ({
      ...prev,
      [unified]: true,
    }));
  };

  return (
    <div>
      {/* Frequently used emojis */}
      {Object.keys(frequentEmojis).length > 0 && (
        <div className="emoji-category relative">
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>Frequently Used</span>
          </div>
          <div className="category-items p-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {Object.entries(frequentEmojis)
              .sort((a, b) => b[1] - a[1]) // Sort by usage frequency
              .map(([unified, count]) => {
                const emoji = emojiDataMap[unified];
                return (
                  emoji && (
                    <ContextMenu key={emoji.u}>
                      <ContextMenuTrigger>
                        <span
                          className="overflow-hidden flex items-center justify-center p-[0.15rem] leading-inherit rounded-[8px] cursor-pointer select-none align-middle relative hover:bg-black/10 dark:hover:bg-white/5"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          <img
                            src={getEmojiImageUrl(emoji)} // Use the new image URL logic
                            alt={emoji.n} // Use updated "n" field for the alt text
                            className="w-[34px] h-[34px] transform origin-center layer-transition opacity-0 scale-75 data-[loaded=true]:opacity-100 data-[loaded=true]:scale-100"
                            width={34}
                            height={34}
                            loading="lazy"
                            onLoad={() => handleImageLoad(emoji.u)} // Add onLoad event
                            data-loaded={
                              imageLoaded[emoji.u] ? "true" : "false"
                            } // Add loaded attribute
                          />
                          <span
                            className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0"
                            data-loaded={
                              imageLoaded[emoji.u] ? "true" : "false"
                            } // Add loaded attribute
                          ></span>
                        </span>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleCopyEmoji(emoji)}>
                          <Icon
                            variant={"transparent"}
                            i="copy"
                            c="drp-icons"
                            className="text-black text-lg"
                          />
                          <span className="pr-4">Copy</span>
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => handleRemoveEmoji(emoji)}
                        >
                          <Icon
                            variant={"transparent"}
                            i="delete"
                            c="drp-icons"
                            className="text-black text-lg"
                          />
                          <span className="pr-4">Remove</span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                );
              })}
          </div>
        </div>
      )}

      {/* Emoji categories */}
      {filteredEmojis.map(({ title, emojis }) => (
        <div key={title} className="emoji-category relative">
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>{title}</span>
          </div>
          <div className="category-items p-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {emojis.map((emoji) => (
              <span
                key={emoji.u}
                className="overflow-hidden flex items-center justify-center p-[0.15rem] leading-inherit rounded-[8px] cursor-pointer select-none align-middle relative hover:bg-black/10 dark:hover:bg-white/5"
                onClick={() => handleEmojiClick(emoji)}
              >
                <img
                  src={getEmojiImageUrl(emoji)} // Use the new image URL logic
                  alt={emoji.n} // Use updated "n" field for the alt text
                  className="w-[34px] h-[34px] transform origin-center layer-transition opacity-0 scale-75 data-[loaded=true]:opacity-100 data-[loaded=true]:scale-100"
                  width={34}
                  height={34}
                  loading="lazy"
                  onLoad={() => handleImageLoad(emoji.u)} // Add onLoad event
                  data-loaded={imageLoaded[emoji.u] ? "true" : "false"} // Add loaded attribute
                />
                <span
                  className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0"
                  data-loaded={imageLoaded[emoji.u] ? "true" : "false"} // Add loaded attribute
                ></span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
