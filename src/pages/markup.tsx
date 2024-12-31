// MarkupContainer.tsx
"use client";
import React, { forwardRef } from "react";
import { IconB } from "@/components/ui/icon-b";
import { Input } from "@/components/ui/input";

interface MarkupContainerProps {
  isSelected: boolean;
  selectionPosition: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
  isLink: boolean;
  linkContent: string;
  toggleMarkupLink: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MarkupContainer = forwardRef<HTMLDivElement, MarkupContainerProps>(
  (
    {
      isSelected,
      selectionPosition,
      isLink,
      linkContent,
      toggleMarkupLink,
      handleInputChange,
    },
    ref
  ) => {
    //   if (!isSelected || !selectionPosition) return null;

    return (
      <div
        id="markup-tooltip"
        className={`bg-background3 rounded-[10px] shadow-[0_2px_2px_#00000024,0_3px_1px_-2px_#0000001f,0_1px_5px_#0003] translate-z-0 opacity-0 fixed inset-0 h-[44px]  ${
          isLink ? "w-[420px]" : "w-[282px]"
        } data-[state=true]:opacity-100 overflow-hidden z-[-5]  data-[state=true]:z-[5] flex justify-start  layer-transition`}
        style={{
          maxWidth: selectionPosition?.width,
          transform: `translate3d(${selectionPosition?.left}px, ${selectionPosition?.top}px, 0px)`,
        }}
        ref={ref}
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
              i="spoiler"
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
                className="text-[#a2acb4] block pointer-events-none select-none absolute opacity-0 max-w-full pr-[0.5rem] left-2 z-1 truncate  transition-all data-[state=empty]:opacity-100 duration-150 ease-in-out transform data-[state=empty]:translate-x-0 data-[state=empty]:translate-y-0  translate-x-[calc(1rem_*_1)] translate-y-0 text-sm"
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
    );
  }
);
MarkupContainer.displayName = "MarkupContainer";

export default MarkupContainer;
