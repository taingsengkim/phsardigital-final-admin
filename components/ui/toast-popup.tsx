"use client"

import * as React from "react"
import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, InfoIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
}

let toastListeners: Array<(toasts: ToastItem[]) => void> = []
let activeToasts: ToastItem[] = []

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...activeToasts]))
}

export function showToast(options: { type?: ToastType; title?: string; message: string }) {
  const id = Math.random().toString(36).substring(2, 9)
  const item: ToastItem = {
    id,
    type: options.type ?? "info",
    title: options.title,
    message: options.message,
  }

  activeToasts = [item, ...activeToasts].slice(0, 5) // max 5 visible toasts
  notifyListeners()

  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

export function removeToast(id: string) {
  activeToasts = activeToasts.filter((t) => t.id !== id)
  notifyListeners()
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    setToasts([...activeToasts])
    const listener = (newToasts: ToastItem[]) => setToasts(newToasts)
    toastListeners.push(listener)

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success"
        const isError = toast.type === "error"
        const isWarning = toast.type === "warning"

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4",
              isSuccess && "border-emerald-100 ring-1 ring-emerald-500/20",
              isError && "border-rose-100 ring-1 ring-rose-500/20",
              isWarning && "border-amber-100 ring-1 ring-amber-500/20",
              !isSuccess && !isError && !isWarning && "border-gray-100 ring-1 ring-[#6338f6]/20"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl shrink-0 mt-0.5",
              isSuccess && "bg-emerald-50 text-emerald-600",
              isError && "bg-rose-50 text-rose-600",
              isWarning && "bg-amber-50 text-amber-600",
              !isSuccess && !isError && !isWarning && "bg-purple-50 text-[#6338f6]"
            )}>
              {isSuccess && <CheckCircle2Icon size={18} />}
              {isError && <XCircleIcon size={18} />}
              {isWarning && <AlertTriangleIcon size={18} />}
              {!isSuccess && !isError && !isWarning && <InfoIcon size={18} />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {toast.title && (
                <h5 className="text-xs font-bold text-gray-900 leading-snug mb-0.5">{toast.title}</h5>
              )}
              <p className="text-xs font-medium text-gray-600 leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            >
              <XIcon size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
