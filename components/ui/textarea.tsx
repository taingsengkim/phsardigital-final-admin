import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-2xl border border-gray-200/80 bg-gray-50/80 px-4 py-3 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#6338f6] focus:ring-2 focus:ring-[#6338f6]/20 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
