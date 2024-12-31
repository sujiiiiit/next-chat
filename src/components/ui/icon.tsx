import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconVariants = cva(
    "box-border text-center text-2xl leading-none rounded-full text-icon p-2 relative transition duration-150 ease-in-out flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-primary text-white",
                ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
                transparent: "bg-transparent",
                outline:
                    "bg-transparent border border-primary-forground hover:bg-accent hover:text-accent-foreground hover:border-0",
            },
            size: {
                default: "p-2",
                sm: "w-9 h-9",
                xs: "w-7 h-7",
                lg: "w-14 h-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface IconProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof iconVariants> {
    asChild?: boolean;
    c?: string; // Icon color
    i?: string; // Icon name
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    ({ className, variant, size, asChild = false, i, c, ...props }, ref) => {
        const Comp = asChild ? Slot : "span";
        return (
            <Comp
                className={cn(iconVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {i && <span className={cn(`tgico-${i}  ${c}`)}></span>}
            </Comp>
        );
    }
);
Icon.displayName = "Icon";

export { Icon, iconVariants };
