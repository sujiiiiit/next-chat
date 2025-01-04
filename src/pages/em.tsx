//em.tsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import lodash from "lodash";
import emojiData from "@/assets/regularEmoji.json";
import { useToast } from "@/hooks/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@/components/ui/icon";
import { regularCategories, frequentCategory } from "./emojiCategory";

// Memoize the emoji data for faster lookup
const emojiDataMap = lodash.memoize((emojiData: any[]) => {
  return emojiData.reduce((map: { [key: string]: any }, emoji: any) => {
    map[emoji.u] = emoji;
    return map;
  }, {});
});



const Em: React.FC = () => {
  const { toast } = useToast();
  const [frequentEmojis, setFrequentEmojis] = useState<{
    [key: string]: number;
  }>({});
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
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
    [regularCategories]
  );

  const getEmojiImageUrl = useCallback(
    (emoji: any) => `/assets/img/apple/64/${emoji.u}.png`,
    []
  );

  useEffect(() => {
    const storedData = localStorage.getItem(frequentCategory.u);
    if (storedData) {
      setFrequentEmojis(JSON.parse(storedData));
    }
  }, []);

  const saveFrequentEmojis = useCallback(
    lodash.debounce((frequentEmojis) => {
      localStorage.setItem(frequentCategory.u, JSON.stringify(frequentEmojis));
    }, 1000),
    []
  );

  useEffect(() => {
    saveFrequentEmojis(frequentEmojis);
  }, [frequentEmojis, saveFrequentEmojis]);

  const handleEmojiClick = useCallback(
    (emoji: any) => {
      toast({
        title: "Emoji Clicked",
        description: JSON.stringify(emoji, null, 2),
      });

      setFrequentEmojis((prev) => ({
        ...prev,
        [emoji.u]: (prev[emoji.u] || 0) + 1,
      }));
    },
    [toast]
  );

  const handleCopyEmoji = (emoji: any) => {
    navigator.clipboard.writeText(emoji.n);
    toast({
      title: "Emoji Copied",
      description: `Copied "${emoji.n}" to clipboard.`,
    });
  };

  const handleRemoveEmoji = (emoji: any) => {
    setFrequentEmojis((prev) => {
      const updated = { ...prev };
      delete updated[emoji.u as string];
      return updated;
    });
    toast({
      title: "Emoji Removed",
      description: `Removed "${emoji.u}" from frequent list.`,
    });
  };

  const handleImageLoad = (unified: string) => {
    setImageLoaded((prev) => ({
      ...prev,
      [unified]: true,
    }));
  };

  return (
    <div>
      {Object.keys(frequentEmojis).length > 0 && (
        <div className="emoji-category relative" data-name={frequentCategory.u}>
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>{frequentCategory.title}</span>
          </div>
          <div className="category-items p-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {Object.entries(frequentEmojis)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([unified, count]) => {
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
                            className="w-[34px] h-[34px]  layer-transition opacity-0  data-[loaded=true]:opacity-100  aspect-square"
                            width={34}
                            height={34}
                            loading="lazy"
                            onLoad={() => handleImageLoad(emoji.u)}
                            data-loaded={
                              imageLoaded[emoji.u as string] ? "true" : "false"
                            }
                          />
                          <span
                            className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0 aspect-square"
                            data-loaded={
                              imageLoaded[emoji.u] ? "true" : "false"
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
      )}

      {filteredEmojis.map(({ title, emojis, u }) => (
        <div key={title} className="emoji-category relative" data-name={u}>
          <div className="category-title text-center text-base font-medium leading-[1.1875rem] p-[0.75rem_0.875rem_0.375rem] w-full relative cursor-pointer pointer-events-none text-black/40 dark:text-white/40">
            <span>{title}</span>
          </div>
          <div className="category-items p-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1">
            {emojis.map((emoji) => (
              <span
                key={emoji.u}
                className="overflow-hidden flex items-center justify-center p-[0.15rem] leading-inherit rounded-[8px] cursor-pointer select-none align-middle relative hover:bg-black/10 dark:hover:bg-white/5 aspect-square"
                onClick={() => handleEmojiClick(emoji)}
              >
                <img
                  src={getEmojiImageUrl(emoji)}
                  alt={emoji.n}
                  className="w-[34px] h-[34px]  layer-transition opacity-0  data-[loaded=true]:opacity-100  aspect-square"
                  width={34}
                  height={34}
                  loading="lazy"
                  onLoad={() => handleImageLoad(emoji.u)}
                  data-loaded={
                    imageLoaded[emoji.u as string] ? "true" : "false"
                  }
                />
                <span
                  className="w-[34px] h-[34px] absolute rounded-full bg-[rgba(112,117,121,0.08)] data-[loaded=true]:opacity-0 aspect-square"
                  data-loaded={imageLoaded[emoji.u] ? "true" : "false"}
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
