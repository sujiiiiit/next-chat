import React, { useCallback, useRef, useState } from "react";
import { IconB } from "@/components/ui/icon-b";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
const Player = React.lazy(() =>
  import("@lottiefiles/react-lottie-player").then((module) => ({
    default: module.Player,
  }))
);
const Em = React.lazy(() => import("../src/pages/em"));
import { scrollToCenter, useScrollAmount } from "@/lib/functions";

const EmojiPage: React.FC = () => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [navPosition, setNavPosition] = useState(false);
  const [searchVisible, setSearchVisible] = useState(true);
  const { isScrolled } = useScrollAmount(containerRef);

  const handleClick = useCallback((event: React.MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    scrollToCenter(containerRef, clickedElement);
  }, []);
  
  const focusInput = useCallback(() => {
    setNavPosition(true);
    searchInputRef.current?.focus();
  }, []);
  
  const onSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() !== "") {
      setSearchVisible(false);
    } else {
      setSearchVisible(true);
    }
  }, []);
  
  const unfocusInput = useCallback(() => {
    if (searchInputRef.current?.value.trim() === "") {
      setNavPosition(false);
      setSearchVisible(true);
    }
  }, []);
  

  const closeSearch = () => {
    setSearchVisible(true);
    setNavPosition(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
      searchInputRef.current.blur();
    }
  };

  const isActive = "active";
  const emojiSearchStyle = {
    width: "1.75rem",
    height: "1.75rem",
    borderRadius: "50%",
    cursor: "pointer",
    padding: ".125rem",
  };
  return (
    <>
      <div
        className="emoji-dropdown flex flex-col w-[23.875rem] h-[26.25rem] bg-dropdown overflow-hidden flex-1 select-none absolute left-[0.8125rem] bottom-[5.125rem] max-w-[calc(100%-1rem)] max-h-[26.25rem] shadow-[0_5px_10px_5px_#10232f24]  rounded-[1.25rem] transition-all scale-0 opacity-0 origin-[0_100%] backdrop-blur-[var(--dropdown-backdrop)] data-[state=active]:scale-100 data-[state=active]:opacity-100 z-10"
        data-state={"active"}
      >
        <div className="emoji-container w-full max-w-full overflow-hidden h-full">
          <div
            className="tab-container min-w-full w-full grid grid-cols-[100%] grid-rows-[100%] h-full
 "
          >
            <div
              className="tabs-tab layer-transition data-[state=active]:flex hidden overflow-hidden flex-col row-start-1 col-start-1 h-full min-h-full"
              data-state="active"
            >
              {/* 1 */}
              <div
                className="p-0 h-[3.0625rem] max-w-full relative border-b border-transparent bg-transparent layer-transition data-[state=true]:-translate-y-[3.0625rem] translate-y-0"
                data-state={navPosition}
              >
                <div className="overflow-y-hidden scrollbar-none">
                  <nav className="w-full h-[3.0625rem] min-h-[3.0625rem] items-center p-0 px-[0.3125rem] z-[4] bg-transparent flex flex-start flex-row overflow-hidden scrollbar-none">
                    <IconB variant={"ghost"} i="recent" />

                    <div
                      className="layer-transition cursor-pointer overflow-hidden overflow-x-auto scrollbar-none flex-none w-[1.875rem] h-[1.875rem] rounded-[15px] m-0 mx-[0.3125rem] data-[state=active]:w-[8.5rem] data-[state=active]:bg-black/5 dark:data-[state=active]:bg-white/5 data-[state=active]:px-[0.275rem] data-[state=active]:gap-[0.3125rem]"
                      data-state={isActive}
                    >
                      <div
                        className="layer-transition relative w-[8.5rem] h-full flex gap-[0.3125rem] flex-start items-center  mx-[0.3125rem] 
                      data-[state=active]:mx-0"
                        data-state={isActive}
                      >
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="smile"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="animals"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="apple"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="car"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="football"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="lamp"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                        <IconB
                          variant={"ghost"}
                          size={"emoji"}
                          i="flag"
                          className="data-[state=active]:scale-[0.8]"
                          data-state={isActive}
                        />
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
              {/* 2 */}
              <div className="flex-1 p-0 relative">
                <ScrollArea
                  className="h-[calc(26.25rem_-_3.0625rem)] layer-transition data-[state=true]:-translate-y-[3.0625rem] translate-y-0"
                  data-state={navPosition}
                >
                  <div
                    className="layer-transition h-[2.375rem] m-0 mx-2 mb-1 rounded-[10px] data-[state=true]:mt-2 "
                    data-state={navPosition}
                  >
                    <div className="relative w-full overflow-hidden flex items-center h-[2.375rem] bg-black/5 dark:bg-white/5 rounded-[10px] m-0">
                      <Input
                        className="layer-transition bg-transparent rounded-[inherit] border-0 px-[calc(1.25rem_+_1.375rem)] z-[1] relative box-border h-[inherit] data-[state=false]:z-[2] font-normal"
                        data-state={searchVisible}
                        ref={searchInputRef}
                        onChange={onSearchInput}
                        onBlur={unfocusInput}
                      />
                      <div
                        className={`layer-transition overflow-hidden overflow-x-auto scrollbar-none  absolute w-auto h-full inset-0 left-[calc(1.25rem_+_1.375rem)] flex items-center justify-between pointer-events-auto z-[1] data-[state=true]:opacity-100 opacity-0 ${
                          isScrolled ? "search-webkit-mask" : ""
                        }`}
                        data-state={searchVisible}
                        ref={containerRef}
                      >
                        <span
                          className="min-w-[132px] truncate h-full flex items-center cursor-text relative pointer-events-auto text-[#9e9e9e]  origin-left-center top-[0.5px] font-normal"
                          onClick={focusInput}
                        >
                          Search Emoji
                        </span>
                        <div className="flex relative  gap-[7px]">
                          {[
                            "Love",
                            "Approval",
                            "Disapproval",
                            "Cheers",
                            "Laughter",
                            "Astonishment",
                            "Sadness",
                            "Anger",
                            "Neutral",
                            "Doubt",
                          ].map((emoji) => (
                            <React.Suspense
                              fallback={<div style={emojiSearchStyle}></div>}
                              key={emoji}
                            >
                              <button
                                onClick={handleClick}
                                className="opacity-60 hover:opacity-100 focus:opacity-100 focus:bg-black/5 dark:focus:bg-white/10 backdrop-dropdown w-fit h-fit rounded-full p-0"
                              >
                                <Player
                                  keepLastFrame={true}
                                  renderer={"canvas"}
                                  rendererSettings={{ clearCanvas: true }}
                                  autoplay={true}
                                  loop={false}
                                  controls={true}
                                  src={`/assets/emojiSearch/${emoji}.json`}
                                  style={emojiSearchStyle}
                                ></Player>
                              </button>
                            </React.Suspense>
                          ))}
                        </div>
                      </div>
                      <Icon
                        variant={"transparent"}
                        size={"xs"}
                        className="opacity-60 absolute left-3"
                        i="search"
                        c="text-xl"
                      />
                      <IconB
                        variant={"ghost"}
                        size={"sm"}
                        className="data-[state=false]:opacity-60 opacity-0 absolute right-3 data-[state=false]:z-[3]"
                        i="close"
                        c="text-xl"
                        data-state={searchVisible}
                        onClick={closeSearch}
                      />
                    </div>
                  </div>
                  <div>
                    <div ref={scrollEmojiset}></div>
                    <Em />
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="tabs-tab layer-transition data-[state=active]:flex hidden overflow-hidden flex-col row-start-1 col-start-1 h-full min-h-full"></div>
            <div className="tabs-tab layer-transition data-[state=active]:flex hidden overflow-hidden flex-col row-start-1 col-start-1 h-full min-h-full"></div>
          </div>
        </div>
        <div className="emoji-tabs"></div>
      </div>
    </>
  );
};

export default EmojiPage;
