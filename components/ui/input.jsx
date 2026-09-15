import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, icon: Icon, iconPosition = "left", ...props }, ref) => {
  if (Icon) {
    return (
      <div
        className={cn(
          "relative flex items-center gap-2.5 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors",
          className
        )}
      >
        {iconPosition === "left" && (
          <Icon className="w-4 h-4 shrink-0 text-muted-foreground pointer-events-none" />
        )}
        <input
          type={type}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none min-w-0 p-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
        {iconPosition === "right" && (
          <Icon className="w-4 h-4 shrink-0 text-muted-foreground pointer-events-none" />
        )}
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
