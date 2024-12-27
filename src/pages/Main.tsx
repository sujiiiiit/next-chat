"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from "next-themes";

import { IconB } from "@/components/ui/icon-b";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import GradientCanvas from "@/pages/GradientCanvas";
import SVGToCanvas from "@/pages/patternRenderer";

const Main: React.FC = () => {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const colRightRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = () => {
    if (colRightRef.current) {
      const { offsetWidth, offsetHeight } = colRightRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // const toggleSearch = () => {
  //   setSearchIsOpen((prevState) => !prevState);
  // };

  const closeSearch = () => {
    setSearchIsOpen(false);
  };

  const openSearch = () => {
    setSearchIsOpen(true);
  };

  const svgClassName = useMemo(
    () => `absolute z-[3] ${isDark ? "" : "mix-blend-soft-light opacity-50"}`,
    [theme]
  );

  return (
    <div className="w-dvw h-dvh flex">
      <div
        id="col-left"
        className="sm:flex-2 w-full max-w-full sm:max-w-[420px] border-r bg-backgeound2"
      >
        <div className="h-dvh flex flex-col min-w-full w-full grid-cols-1 grid-rows-1">
          {/* sidebar header  */}
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
                      className="text-black text-lg"
                    />
                    <span className="pr-4">Saved Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="archive"
                      className="text-black text-xl"
                    />
                    <span className="pr-4">Archives</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="stories"
                      className="text-black text-xl"
                    />
                    My Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="newprivate"
                      className="text-black text-xl"
                    />
                    Contacts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon
                      variant={"transparent"}
                      i="settings"
                      className="text-black text-xl"
                    />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                  >
                    <Icon
                      variant={"transparent"}
                      i="darkmode"
                      className="text-black text-xl"
                    />
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="relative outline-0 w-full border-2 h-[42px] rounded-full flex items-center mx-2 transition-all duration-200 ease-in-out group  focus-within:border-primaryColor box-border bg-[var(--background2)]   focus-within:bg-background3 group ">
              <input
                type="text"
                className="w-full bg-transparent z-[2] h-full rounded-full px-[calc(42px_+_3px_+_1px)] border-0 outline-0 transition-all duration-100 ease-in-out placeholder:text-text2 placeholder:font-medium"
                placeholder="Search"
                onFocus={openSearch}
              />
              <Icon
                variant={"transparent"}
                i="search"
                className="absolute left-1 transition-all duration-200 ease-in-out group-focus-within:text-primaryColor "
              />
              <IconB
                variant={"transparent"}
                i="close"
                className={`absolute right-1 transition-all duration-200 ease-in-out ${
                  searchIsOpen ? "flex" : "hidden"
                } group-focus-within:text-primaryColor z-[3]`}
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
        className="relative w-full flex items-center flex-col row-start-1 col-start-1 bg-background overflow-hidden"
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
      </div>
    </div>
  );
};

export default Main;
