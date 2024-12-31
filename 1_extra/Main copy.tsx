"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useSearch, useClearSearch, useSearchInput } from "@/hooks/useSearch";
import { useInputHandler } from "@/hooks/useInputHandler";
import { useToggleState } from "@/hooks/useToggleState";
import { IconB } from "@/components/ui/icon-b";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@custom-react-hooks/use-media-query";
import dynamic from "next/dynamic";
import SVG from "@/pages/svg";
import { Input } from "@/components/ui/input";
import { useSelectionPosition } from "@/hooks/useMarkupPosition";

const SVGToCanvas = dynamic(() => import("@/pages/patternRenderer"), {
  ssr: false,
});
const GradientCanvas = dynamic(() => import("@/pages/GradientCanvas"), {
  ssr: false,
});

const Main: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const svgClassName = useMemo(
    () => `absolute z-[3] ${isDark ? "" : "mix-blend-soft-light opacity-50"}`,
    [theme]
  );

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const { colRightRef, dimensions } = useWindowDimensions();
  const { contentEditableRef, hasContent } = useContentEditable();
  const { inputRef, clearInput } = useClearSearch();
  const { searchContent, handleSearchChange } = useSearchInput();
  const { searchIsOpen, openSearch, closeSearch } = useSearch();
  const { linkContent, handleInputChange, isLink, toggleMarkupLink } =
    useInputHandler();
  const { selectionRef, markupContainerRef, selectionPosition,isSelected } =
    useSelectionPosition();
  const { state: dataState, toggleState: toggleDataState } =
    useToggleState("leftOpen");
  const inbtw = useMediaQuery(
    "only screen and (min-width : 640px) and (max-width : 1024px)"
  );

  const isMobile = useMediaQuery("only screen and (max-width : 640px)");

  return (
    <div className="w-dvw h-[calc(var(--vh,1vh)*100)] flex overflow-hidden relative">
      <SVG />
      <div
        id="col-left"
        className={`layer-transition sm:flex-2 w-full max-w-full   sm:border-r lg:translate-x-0 dark:border-background bg-backgeound2 overflow-hidden 
          data-[state=leftOpen]:-translate-x-0 -translate-x-20  lg:data-[state=leftOpen]:translate-x-0 
         

        sm:data-[state=leftOpen]:translate-x-0 sm:fixed sm:left-0 sm:top-0  sm:w-[26.5rem] sm:-translate-x-20 
        
        fixed   lg:relative lg:w-full lg:max-w-[420px]

        `}
        // sm:max-w-[420px]
        data-state={dataState}
      >
        <div className="h-dvh flex flex-col min-w-full w-full grid-cols-1 grid-rows-1">
          {/* Sidebar header */}
          <div
            id="sidebar-header"
            className="w-full bg-background3 flex px-4 items-center h-[3.5rem] flex-none select-none cursor-default"
          >
            {searchIsOpen ? (
              <IconB variant={"ghost"} i="previous" onClick={closeSearch} />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-0" asChild>
                  <IconB variant={"ghost"} i="menu" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="savedmessages"
                      c="drp-icons"
                      className="text-black text-lg"
                    />
                    <span className="pr-4">Saved Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="archive"
                      c="drp-icons"
                      className="text-black text-xl"
                    />
                    <span className="pr-4">Archives</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="stories"
                      c="drp-icons"
                      className="text-black text-xl"
                    />
                    My Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="newprivate"
                      c="drp-icons"
                      className="text-black text-xl"
                    />
                    Contacts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="settings"
                      c="drp-icons"
                      className="text-black text-xl"
                    />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    <Icon
                      variant={"transparent"}
                      i="darkmode"
                      c="drp-icons"
                      className="text-black text-xl"
                    />
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="relative outline-0 w-full border-2 h-[42px] rounded-full flex items-center mx-2 transition-all duration-200 ease-in-out group focus-within:border-primaryColor box-border bg-[var(--background2)] focus-within:bg-background3 group">
              <input
                type="text"
                className="w-full bg-transparent z-[2] h-full rounded-full px-[calc(42px_+_3px_+_1px)] border-0 outline-0 transition-all duration-100 ease-in-out placeholder:text-text2 placeholder:font-medium"
                onFocus={openSearch}
                ref={inputRef}
                onChange={handleSearchChange}
              />
              <span
                className="text-[#a2acb4] block pointer-events-none absolute opacity-0 max-w-full pr-[0.5rem] left-[calc(42px_+_3px_+_1px)] z-1 whitespace-nowrap overflow-ellipsis overflow-hidden transition-all data-[state=empty]:opacity-100 duration-150 ease-in-out transform data-[state=empty]:translate-x-0 data-[state=empty]:translate-y-0  translate-x-[calc(1rem_*_1)] translate-y-0 "
                data-state={searchContent ? "full" : "empty"}
              >
                Search
              </span>
              <Icon
                variant={"transparent"}
                i="search"
                c="text-text2 group-focus-within:text-primaryColor"
                className="absolute group left-1 transition-all duration-200 ease-in-out group-focus-within:text-primaryColor"
              />
              <IconB
                variant={"transparent"}
                i="close"
                className={`absolute right-1 transition-all duration-200 ease-in-out ${
                  searchIsOpen ? "flex" : "hidden"
                } group-focus-within:text-primaryColor z-[3]`}
                onClick={clearInput}
              />
            </div>
          </div>
          <div
            className={`w-full bg-background3 max-h-full h-full overflow-hidden flex relative flex-1 justify-center transitions zoom-fade animating backwards`}
          >
            <div
              className={`${
                searchIsOpen ? "from" : "active to"
              } transition-item relative max-h-full top-0 left-0 w-full h-full [animation-fill-mode:forwards!important] bg-background3 z-[2]`}
            >
              My name is Manas
              <Button onClick={toggleDataState}>Toggle</Button>
            </div>
            <div
              className={`${
                searchIsOpen ? "active to" : "from"
              } transition-item absolute max-h-full top-0 left-0 w-full h-full [animation-fill-mode:forwards!important] bg-background3 z-[3]`}
            >
              My name is Sujit
            </div>
          </div>
        </div>
      </div>

      <div
        id="col-right"
        ref={colRightRef}
        className={`layer-transition w-full flex items-center flex-col row-start-1 col-start-1 bg-background overflow-hidden
        sm:data-[state=leftOpen]:translate-x-[26.5rem] sm:fixed lg:relative h-[calc(var(--vh,1vh)*100)]
              max-sm:translate-x-0
        fixed data-[state=leftOpen]:translate-x-full  lg:data-[state=leftOpen]:translate-x-0
          `}
        data-state={dataState}
      >
        <div
          id="chat-bg"
          className="chat-bg absolute"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <GradientCanvas
            colors={`${
              isDark
                ? "#fec496,#dd6cb9,#962fbf,#4f5bd5"
                : "#dbddbb,#6ba587,#d5d88d,#88b884"
            }`}
            className="absolute z-[2] gradient-canvas w-full h-[150%] top-[-25%] !m-0 dark:[mask-size:cover] dark:[mask-position:center]"
          />

          <SVGToCanvas
            url={"/pattern.svg"}
            width={dimensions.width}
            height={dimensions.height}
            mask={isDark}
            className={svgClassName}
          />
        </div>
        <div className="w-full relative h-14 bg-background3 z-[4] px-2 sm:px-4 flex items-center">
          {inbtw || isMobile ? (
            <IconB variant={"ghost"} i="previous" onClick={toggleDataState} />
          ) : null}
        </div>
        <div className="w-full flex-1 relative z-[4]"></div>
        {/* Last Section */}
        <div className="flex justify-center w-full max-w-full flex-col flex-none relative pt-1 z-[3]">
          <div className="flex m-auto w-full xl:w-[calc(100%_-_25dvw)] pb-2 sm:pb-5 px-2 sm:px-3 max-w-[var(--chat-input-max-width)]">
            <div className="flex w-full gap-1">
              <div
                className="flex flex-col w-[calc(100%_-_(3.357rem_+_0.5rem))] max-w-[calc(100%_-_3.357rem_+_0.5rem)] justify-center rounded-[1rem] min-h-[2.875rem]  sm:min-h-[3.375rem] max-h-[30rem] flex-none relative z-[3] before:content-[''] before:absolute before:inset-0 before:rounded-[1rem] before:rounded-br-none before:shadow-[0_1px_8px_1px_#0000001f] before:bg-background3 before:opacity-100 "
                ref={selectionRef}
              >
                <svg
                  viewBox="0 0 11 20"
                  width="11"
                  height="20"
                  className="absolute bottom-[-1px] right-[-8.4px] w-[11px] h-[20px] fill-background3 [transform:scaleX(calc(1_*_-1))]"
                >
                  <use href="#message-tail-filled"></use>
                </svg>

                <div
                  className="reply-wrapper transition-all duration-150 ease-out justify-start h-0 w-full pt-[0.5625rem] px-2 mb-[-0.5625rem] items-center select-none z-3 opacity-0 pointer-events-none data-[state=active]:pointer-events-auto data-[state=active]:h-[45px] data-[state=active]:opacity-100 rounded-[1rem] bg-background3 relative flex "
                  // data-state={"active"}
                ></div>
                <div className="message-cont py-[0.3125rem] px-2 min-h-[2.875rem]  sm:min-h-[3.375rem] rounded-[1rem] flex justify-between items-center">
                  <IconB
                    variant={"ghost"}
                    i="smile"
                    size={"sm"}
                    className="mx-[0.12rem]"
                  />
                  <div className=" px-2 flex items-center w-[1%] flex-1 relative overflow-hidden self-center">
                    <div
                      id="input-message-container"
                      className="w-full p-[0.5rem_0] overflow-y-auto resize-none border-none outline-none text-base transition-duration-[0ms] h-[37px] transition-[height_0.1s]  overflow-y-overlay scrollbar-thin relative max-h-[27.5rem]!important leading-[1.37rem] [scrollbar-width:none!important]
"
                      ref={contentEditableRef}
                      contentEditable="true"
                    ></div>
                    <span
                      className="text-[#a2acb4] block pointer-events-none absolute opacity-0 max-w-full pr-[0.5rem] left-[var(--padding-horizontal)] z-1 whitespace-nowrap overflow-ellipsis overflow-hidden transition-all data-[state=empty]:opacity-100 duration-150 ease-in-out transform data-[state=empty]:translate-x-0 data-[state=empty]:translate-y-0  translate-x-[calc(1rem_*_1)] translate-y-0"
                      data-state={hasContent ? "full" : "empty"}
                    >
                      Message
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-0" asChild>
                      <IconB
                        variant={"ghost"}
                        i="attach"
                        size={"sm"}
                        className="mx-[0.12rem]"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={15}>
                      <DropdownMenuItem>
                        <Icon
                          variant={"transparent"}
                          i="image"
                          c="drp-icons"
                          className="text-black text-lg"
                        />
                        <span className="pr-4">Photos or Videos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Icon
                          variant={"transparent"}
                          i="document"
                          c="drp-icons"
                          className="text-black text-lg"
                        />
                        <span className="pr-4">Document</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex">
                <IconB
                  variant={"default"}
                  i="send2"
                  size={"lg"}
                  className="mx-[0.12rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="markup-tooltip"
        className={`bg-background3 rounded-[10px] shadow-[0_2px_2px_#00000024,0_3px_1px_-2px_#0000001f,0_1px_5px_#0003] translate-z-0 opacity-0 fixed inset-0 h-[44px]  ${
          isLink ? "w-[420px]" : "w-[282px]"
        } data-[state=true]:opacity-100 overflow-hidden z-[-5]  data-[state=true]:z-[5] flex justify-start  layer-transition`}
        style={{
          maxWidth: selectionPosition?.width,
          transform: `translate3d(${selectionPosition?.left}px, ${selectionPosition?.top}px, 0px)`,
        }}
        ref={markupContainerRef}
        data-state={isSelected} // Both states can be here
      >
        <div className="markup-wrapper h-[44px] absolute left-0 top-0 flex items-center justify-start w-[702px]   layer-transition max-w-full">
          <div
            className={`flex items-center h-[44px] justify-between p-[7px] flex-none max-w-full w-[282px] layer-transition ${
              isLink ? "-translate-x-[282px]" : ""
            }`}
          >
            <IconB
              variant={"ghost"}
              i="bold"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="italic"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="underline"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="strikethrough"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="monospace"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="mediaspoiler"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <IconB
              variant={"ghost"}
              i="quote_outline"
              className="rounded-[8px] p-0 w-7 h-7"
            />
            <span className="h-6 w-[1px] border-r"></span>
            <IconB
              variant={"ghost"}
              i="link"
              className="rounded-[8px] p-0 w-7 h-7"
              onClick={toggleMarkupLink}
            />
          </div>
          <div
            className={`flex items-center h-[44px] justify-between p-[7px] flex-none max-w-full w-[420px] ${
              isLink ? "-translate-x-[282px]" : "translate-x-0"
            } layer-transition`}
          >
            <IconB
              variant={"ghost"}
              i="previous"
              className="rounded-[8px] p-0 w-7 h-7"
              onClick={toggleMarkupLink}
            />
            <span className="h-6 w-[1px] border-r m-1"></span>
            <div className="flex flex-1 relative items-center">
              <Input
                id="link-input"
                type="text"
                className="truncate flex-1 h-7 bg-transparent border-0 outline-0 shadow-none px-2"
                onChange={handleInputChange}
              />
              <span
                className="text-[#a2acb4] block pointer-events-none absolute opacity-0 max-w-full pr-[0.5rem] left-2 z-1 whitespace-nowrap overflow-ellipsis overflow-hidden transition-all data-[state=empty]:opacity-100 duration-150 ease-in-out transform data-[state=empty]:translate-x-0 data-[state=empty]:translate-y-0  translate-x-[calc(1rem_*_1)] translate-y-0 "
                data-state={linkContent ? "full" : "empty"}
              >
                Enter link
              </span>
            </div>
            <span className="h-6 w-[1px] border-r m-1"></span>

            <IconB
              variant={"ghost"}
              i="check"
              className="rounded-[8px] p-0 w-7 h-7"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
