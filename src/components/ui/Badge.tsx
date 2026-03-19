import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline" | "accent";
}

export function Badge({
  className,
  variant = "primary",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-primary-100 text-primary-800": variant === "primary",
          "bg-gray-100 text-gray-800": variant === "secondary",
          "border border-primary-200 text-primary-800": variant === "outline",
          "bg-accent text-white": variant === "accent",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
