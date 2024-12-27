import * as React from "react";
import { cn } from "@/lib/utils";

const FInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <label className="box-border relative w-full flex flex-col">
        <input
          type={type}
          ref={ref}
          className={cn(
            "box-border bg-transparent  border border-gray-700 rounded-[10px] w-full h-11 px-4 text-base outline-none  hover:border-primary placeholder-transparent peer focus:border-2 transition-all",
            className
          )}
          {...props}
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-[0.1rem] peer-focus:text-xs peer-focus:text-primary peer-focus:left-2 bg-background px-2 overflow-hidden truncate">
            {props.placeholder}
        </span>
      </label>
    );
  }
);

FInput.displayName = "Input";

export { FInput };
