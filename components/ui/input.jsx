import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, icon: Icon, iconPosition = "left", ...props }, ref) => {
  if (Icon) {
    return (
      <div className="relative flex items-center w-full">
        <Icon className={cn(
          "absolute text-muted-foreground w-4 h-4 pointer-events-none z-10",
          iconPosition === "left" ? "left-3" : "right-3"
        )} />
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            iconPosition === "left" ? "pl-9" : "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
