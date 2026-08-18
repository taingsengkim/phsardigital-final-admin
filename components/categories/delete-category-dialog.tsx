"use client"

import { AlertTriangleIcon, Trash2Icon, XIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteCategoryDialogProps {
  isOpen: boolean
  categoryName?: string
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCategoryDialog({
  isOpen,
  categoryName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6 relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <XIcon size={18} />
        </button>

        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangleIcon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Delete Category</h3>
            <p className="text-xs text-gray-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm text-gray-600 leading-relaxed">
          Are you sure you want to delete <strong className="text-gray-900">{categoryName || "this category"}</strong>? All associated details and settings for this category will be permanently removed.
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl h-11 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-500/20"
          >
            {isDeleting ? (
              <>
                <Loader2Icon size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2Icon size={16} />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
