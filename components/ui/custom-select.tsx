"use client"

import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  triggerClassName,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left w-full sm:w-auto", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "bg-gray-50/90 hover:bg-gray-100/90 px-4 h-10 rounded-xl text-xs font-bold text-gray-700 border border-gray-200/80 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6338f6]/30 focus:border-[#6338f6] transition-all cursor-pointer shadow-2xs flex items-center justify-between gap-3 w-full min-w-[140px]",
          isOpen && "ring-2 ring-[#6338f6]/30 border-[#6338f6] bg-white",
          disabled && "opacity-50 cursor-not-allowed",
          triggerClassName
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={cn("size-4 text-gray-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180 text-[#6338f6]")}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-0 mt-1.5 z-50 min-w-[180px] max-w-[320px] max-h-60 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-[#6338f6]/10 text-[#6338f6] font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="truncate flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {isSelected && <CheckIcon className="size-3.5 text-[#6338f6] shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
