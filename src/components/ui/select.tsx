import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({
  className,
  options,
  children,
  ...props
}: SelectProps) {
  try {
    return (
      <select
        className={cn(
          "w-full rounded-md border bg-background px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
    );
  } catch (error) {
    console.error("Error rendering Select:", error);
    return null;
  }
}
