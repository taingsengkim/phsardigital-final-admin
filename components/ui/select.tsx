"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  children: React.ReactNode
  defaultValue?: string
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string
  children?: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
  value?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
  onSelect?: (value: string) => void
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onSelect?: (value: string) => void
}

const Select = ({ children, defaultValue, onValueChange }: SelectProps) => {
  const [value, setValue] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (val: string) => {
    setValue(val)
    onValueChange?.(val)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child
        }

        if (child.type === SelectTrigger) {
          return React.cloneElement(child as React.ReactElement<SelectTriggerProps>, { 
            onClick: () => setIsOpen(!isOpen),
            value 
          })
        }
        if (child.type === SelectContent) {
          return isOpen
            ? React.cloneElement(child as React.ReactElement<SelectContentProps>, { onSelect: handleSelect })
            : null
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ className, children, value, onClick, ...props }: SelectTriggerProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      {...props}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6338f6] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {value ? children : <span className="text-gray-400">Select...</span>}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

const SelectValue = ({ placeholder, value }: SelectValueProps) => {
  return <span>{value || placeholder}</span>
}

const SelectContent = ({ children, onSelect, className }: SelectContentProps) => {
  return (
    <div className={cn(
      "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md animate-in fade-in-80 zoom-in-95",
      className
    )}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child
        }

        return React.cloneElement(child as React.ReactElement<SelectItemProps>, { onSelect })
      })}
    </div>
  )
}

const SelectItem = ({ value, children, onSelect, className }: SelectItemProps) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
