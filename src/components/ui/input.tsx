import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-primary shadow-sm transition-all duration-300",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-secondary",
        "focus-visible:outline-none focus-visible:border-teal-primary focus-visible:ring-2 focus-visible:ring-teal-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
