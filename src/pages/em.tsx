import React, { useEffect, useMemo, useCallback, useState } from "react";
import lodash from "lodash";
import rawEmojiData from "@/assets/regularEmoji.json";
import { useToast } from "@/hooks/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@/components/ui/icon";
import { regularCategories, frequentCategory } from "./emojiCategory";

interface EmProps {
  onFrequentEmojisUpdate: (frequentEmojis: Record<string, number>) => void;
}

// Ensure all 'c' properties are numbers
const emojiData = rawEmojiData.map((emoji) => ({
  ...emoji,
  c: Number(emoji.c),
}));

// Memoize the emoji data for faster lookup
const emojiDataMap = lodash.memoize((emojiData) => {
  return emojiData.reduce(
    (
      map: { [key: string]: (typeof emojiData)[0] },
      emoji: (typeof emojiData)[0]
    ) => {
      map[emoji.u] = emoji;
      return map;
    },
    {}
  );
});

const Em: React.FC<EmProps> = ({ onFrequentEmojisUpdate }) => {
  const { toast } = useToast();
  const [imageLoadingState, setImageLoadingState] = useState<{
    [key: string]: boolean;
  }>({});

  const [frequentEmojis, setFrequentEmojis] = useState<Record<string, number>>(
    {}
  );

  // Filter and sort emojis based on categories
  const filteredEmojis = useMemo(
    () =>
      regularCategories.map(({ title, categories, u }) => ({
        title,
        u,
        emojis: emojiData
          .filter((emoji) => categories.includes(Number(emoji.c)))
          .sort((a, b) => a.o - b.o),
      })),
    []
  );

  const getEmojiImageUrl = useCallback(
    (emoji: { u: string }) => `/static/assets/img/apple/64/${emoji.u}.png`,
    []
  );

  useEffect(() => {
    const storedData = localStorage.getItem(frequentCategory.u);
    if (storedData) {
      setFrequentEmojis(JSON.parse(storedData));
    }
  }, [setFrequentEmojis]);

  const saveFrequentEmojis = useCallback(
    lodash.debounce((frequentEmojis) => {
      localStorage.setItem(frequentCategory.u, JSON.stringify(frequentEmojis));
      onFrequentEmojisUpdate(frequentEmojis);
    }, 1000),
    [onFrequentEmojisUpdate]
  );

  useEffect(() => {
    saveFrequentEmojis(frequentEmojis);
  }, [frequentEmojis, saveFrequentEmojis]);

  const handleEmojiClick = useCallback(
    (emoji: { u: string; n: string; c: number; o: number }) => {
      toast({
        title: "Emoji Clicked",
        description: JSON.stringify(emoji, null, 2),
      });

      setFrequentEmojis((prevFrequentEmojis) => ({
        ...prevFrequentEmojis,
        [emoji.u]: (prevFrequentEmojis[emoji.u] || 0) + 1,
      }));
    },
    [toast]
  );

  const handleCopyEmoji = (emoji: { u: string; n: string }) => {
    navigator.clipboard.writeText(emoji.n);
    toast({
      title: "Emoji Copied",
      description: `Copied "${emoji.n}" to clipboard.`,
    });
  };

  const handleRemoveEmoji = (emoji: { u: string }) => {
    const updated = { ...frequentEmojis };
    delete updated[emoji.u];
    setFrequentEmojis(updated);
    toast({
      title: "Emoji Removed",
      description: `Removed "${emoji.u}" from frequent list.`,
    });
  };

  const handleImageLoad = (unified: string) => {
    setImageLoadingState((prevState) => ({
      ...prevState,
      [unified]: true,
    }));
  };

  return (
    <div>
      {
        <div
          className="emoji-category relative hidden data-[active=true]:block"
          data-active={Object.keys(frequentEmojis).length > 0}
          data-name={frequentCategory.u}
        >
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>{frequentCategory.title}</span>
          </div>
          <div className="category-items px-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {Object.entries(frequentEmojis)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([unified]) => {
                const emoji = emojiDataMap(emojiData)[unified];
                return (
                  emoji && (
                    <ContextMenu key={emoji.u}>
                      <ContextMenuTrigger>
                        <span
                          className="overflow-hidden flex items-center justify-center p-[0.15rem] leading-inherit rounded-[8px] cursor-pointer select-none align-middle relative hover:bg-black/10 dark:hover:bg-white/5 aspect-square"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          <img
                            src={getEmojiImageUrl(emoji)}
                            alt={emoji.n}
                            className="w-[34px] h-[34px] layer-transition opacity-0 data-[loaded=true]:opacity-100 aspect-square"
                            width={34}
                            height={34}
                            loading="lazy"
                            onLoad={() => handleImageLoad(emoji.u)}
                            data-loaded={
                              imageLoadingState[emoji.u] ? "true" : "false"
                            }
                          />
                          <span
                            className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0 aspect-square"
                            data-loaded={
                              imageLoadingState[emoji.u] ? "true" : "false"
                            }
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
      }

      {filteredEmojis.map(({ title, emojis, u }) => (
        <div key={title} className="emoji-category relative" data-name={u}>
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>{title}</span>
          </div>
          <div className="category-items px-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {emojis.map((emoji) => (
              <span
                key={emoji.u}
                className="overflow-hidden flex items-center justify-center p-[0.15rem] leading-inherit rounded-[8px] cursor-pointer select-none align-middle relative hover:bg-black/10 dark:hover:bg-white/5 aspect-square"
                onClick={() => handleEmojiClick(emoji)}
              >
                <img
                  src={getEmojiImageUrl(emoji)}
                  alt={emoji.n}
                  className="w-[34px] h-[34px] layer-transition opacity-100 data-[loaded=true]:opacity-100 aspect-square"
                  width={34}
                  height={34}
                  loading="lazy"
                  onLoad={() => handleImageLoad(emoji.u)}
                  data-loaded={imageLoadingState[emoji.u] ? "true" : "false"}
                />
                <span
                  className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0 aspect-square"
                  data-loaded={imageLoadingState[emoji.u] ? "true" : "false"}
                ></span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Em;