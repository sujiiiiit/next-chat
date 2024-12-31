import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "box-border  text-center text-2xl leading-none rounded-full text-icon p-2 relative transition duration-150 ease-in-out flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primaryColor text-white",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        transparent: "bg-transparent",
        outline:
          "bg-transparent border border-primary-forground hover:bg-accent hover:text-accent-foreground hover:border-0",
      },
      size: {
        default: "p-2",
        sm: "w-9 h-9",
        lg: "w-[var(--msg-height)] h-[var(--msg-height)]",
        emoji:
          "w-[1.875rem] h-[1.875rem p-0 px-0 bg-transparent hover:bg-transparent",
        customemoji: "w-[2.375rem] h-[2.375rem p-1 !rounded-[0.25rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  c?: string; // Icon color
  i?: string; // Icon name
}

const IconB = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, i, c, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "layer-transition"
        )}
        ref={ref}
        {...props}
      >
        {i && <span className={`tgico-${i} ${c} `}></span>}
      </Comp>
    );
  }
);
IconB.displayName = "Button";

export { IconB, buttonVariants };
