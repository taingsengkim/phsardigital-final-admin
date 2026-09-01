"use client"

import { useState, useEffect } from "react"
import {
  XIcon,
  PlusIcon,
  SaveIcon,
  Loader2Icon,
  SlidersIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import type {
  CategoryAttributeResponse,
  CategoryAttributeRequest,
  CategoryAttributeDataType,
  CategoryAttributeOptionRequest,
} from "@/lib/types/category"

interface CategoryAttributeModalProps {
  isOpen: boolean
  onClose: () => void
  categoryName: string
  attributeToEdit?: CategoryAttributeResponse | null
  isSubmitting?: boolean
  onSubmit: (data: CategoryAttributeRequest) => Promise<void>
}

const DATA_TYPES: { value: CategoryAttributeDataType; label: string }[] = [
  { value: "TEXT", label: "Text Field" },
  { value: "NUMBER", label: "Number / Metric" },
  { value: "BOOLEAN", label: "Yes / No (Boolean)" },
  { value: "SELECT", label: "Single Select Dropdown" },
  { value: "MULTI_SELECT", label: "Multi-Select Choices" },
]

function formatCode(val: string) {
  return val
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function CategoryAttributeModal({
  isOpen,
  onClose,
  categoryName,
  attributeToEdit,
  isSubmitting = false,
  onSubmit,
}: CategoryAttributeModalProps) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [group, setGroup] = useState("")
  const [dataType, setDataType] = useState<CategoryAttributeDataType>("TEXT")
  const [unit, setUnit] = useState("")
  const [required, setRequired] = useState(false)
  const [filterable, setFilterable] = useState(true)
  const [minValue, setMinValue] = useState<string>("")
  const [maxValue, setMaxValue] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [options, setOptions] = useState<CategoryAttributeOptionRequest[]>([])
  const [newOptionValue, setNewOptionValue] = useState("")
  const [newOptionLabel, setNewOptionLabel] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const isEditing = Boolean(attributeToEdit)

  useEffect(() => {
    if (isOpen && attributeToEdit) {
      setCode(attributeToEdit.code)
      setLabel(attributeToEdit.label)
      setGroup(attributeToEdit.group || "")
      setDataType(attributeToEdit.dataType)
      setUnit(attributeToEdit.unit || "")
      setRequired(attributeToEdit.required ?? false)
      setFilterable(attributeToEdit.filterable ?? true)
      setMinValue(
        attributeToEdit.minValue !== undefined && attributeToEdit.minValue !== null
          ? String(attributeToEdit.minValue)
          : ""
      )
      setMaxValue(
        attributeToEdit.maxValue !== undefined && attributeToEdit.maxValue !== null
          ? String(attributeToEdit.maxValue)
          : ""
      )
      setSortOrder(attributeToEdit.sortOrder ?? 0)
      setOptions(
        attributeToEdit.options?.map((opt) => ({
          value: opt.value,
          label: opt.label,
          sortOrder: opt.sortOrder,
        })) || []
      )
    } else if (isOpen) {
      setCode("")
      setLabel("")
      setGroup("General")
      setDataType("TEXT")
      setUnit("")
      setRequired(false)
      setFilterable(true)
      setMinValue("")
      setMaxValue("")
      setSortOrder(0)
      setOptions([])
    }
    setNewOptionValue("")
    setNewOptionLabel("")
    setValidationError(null)
  }, [isOpen, attributeToEdit])

  if (!isOpen) return null

  const handleLabelChange = (val: string) => {
    setLabel(val)
    if (!isEditing && !code) {
      setCode(formatCode(val))
    }
  }

  const handleAddOption = () => {
    const val = newOptionValue.trim()
    if (!val) return
    if (options.some((o) => o.value.toLowerCase() === val.toLowerCase())) {
      setValidationError("Option value must be unique.")
      return
    }
    setOptions((prev) => [
      ...prev,
      {
        value: val,
        label: newOptionLabel.trim() || val,
        sortOrder: prev.length,
      },
    ])
    setNewOptionValue("")
    setNewOptionLabel("")
    setValidationError(null)
  }

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    const trimmedCode = formatCode(code.trim())
    const trimmedLabel = label.trim()

    if (!trimmedCode) {
      setValidationError("Attribute Code is required.")
      return
    }
    if (!trimmedLabel) {
      setValidationError("Attribute Label is required.")
      return
    }

    if (
      (dataType === "SELECT" || dataType === "MULTI_SELECT") &&
      options.length === 0
    ) {
      setValidationError("Please add at least one option for select attributes.")
      return
    }

    const payload: CategoryAttributeRequest = {
      code: trimmedCode,
      label: trimmedLabel,
      group: group.trim() || undefined,
      dataType,
      unit: unit.trim() || undefined,
      required,
      filterable,
      minValue: minValue.trim() ? Number(minValue) : undefined,
      maxValue: maxValue.trim() ? Number(maxValue) : undefined,
      sortOrder: Number(sortOrder) || 0,
      options:
        dataType === "SELECT" || dataType === "MULTI_SELECT" ? options : undefined,
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch {
      // error handled in parent
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#f8f7ff] shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-purple-100 text-[#6338f6] rounded-2xl flex items-center justify-center shadow-xs">
              <SlidersIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {isEditing ? `Edit Attribute: ${attributeToEdit?.label}` : "Add Category Attribute"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                For category: <span className="font-bold text-[#6338f6]">{categoryName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors border border-gray-100"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto grow">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs font-semibold text-rose-600">
              {validationError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Label *
              </label>
              <Input
                value={label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="e.g. RAM, Storage, Fuel Type"
                required
                className="rounded-xl h-10 text-xs border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Code Key *
              </label>
              <Input
                value={code}
                onChange={(e) => setCode(formatCode(e.target.value))}
                placeholder="e.g. ram_size, fuel_type"
                required
                className="rounded-xl h-10 text-xs font-mono border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Data Type *
              </label>
              <CustomSelect
                value={dataType}
                onChange={(v) => setDataType(v as CategoryAttributeDataType)}
                options={DATA_TYPES}
                triggerClassName="h-10 rounded-xl bg-white border-gray-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Group (Section)
              </label>
              <Input
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="e.g. Performance, General"
                className="rounded-xl h-10 text-xs border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Unit (Optional)
              </label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="GB, cm, kg..."
                className="rounded-xl h-10 text-xs border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Min Value
              </label>
              <Input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                placeholder="Min"
                className="rounded-xl h-10 text-xs border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                Max Value
              </label>
              <Input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                placeholder="Max"
                className="rounded-xl h-10 text-xs border-gray-200"
              />
            </div>
          </div>

          {/* Options for SELECT / MULTI_SELECT */}
          {(dataType === "SELECT" || dataType === "MULTI_SELECT") && (
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">
                  Predefined Options ({options.length})
                </label>
                <span className="text-[10px] text-gray-400 font-medium">
                  Values users can choose from
                </span>
              </div>

              {/* Existing Options List */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-xs shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-gray-800">{opt.label || opt.value}</span>
                      {opt.label && opt.label !== opt.value && (
                        <span className="text-[10px] text-gray-400 font-mono ml-2">
                          ({opt.value})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2Icon size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Option Inputs */}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder="Option Value (e.g. 8GB)"
                  className="h-8 rounded-lg text-xs bg-white border-gray-200 flex-1"
                />
                <Input
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Label (optional)"
                  className="h-8 rounded-lg text-xs bg-white border-gray-200 flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddOption}
                  disabled={!newOptionValue.trim()}
                  className="h-8 px-3 rounded-lg bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold shrink-0"
                >
                  <PlusIcon size={13} /> Add
                </Button>
              </div>
            </div>
          )}

          {/* Flags: Required & Filterable */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-2xl border border-gray-200/80 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-900">Required</p>
                <p className="text-[10px] text-gray-400">Must be provided on listing</p>
              </div>
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl border border-gray-200/80 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-900">Filterable</p>
                <p className="text-[10px] text-gray-400">Shows in search filters</p>
              </div>
              <input
                type="checkbox"
                checked={filterable}
                onChange={(e) => setFilterable(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
              />
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">
              Sort Order
            </label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="rounded-xl h-10 text-xs border-gray-200"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 px-4 font-bold border-gray-200 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !code.trim() || !label.trim()}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-10 px-5 text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              {isSubmitting ? (
                <Loader2Icon size={14} className="animate-spin" />
              ) : isEditing ? (
                <SaveIcon size={14} />
              ) : (
                <PlusIcon size={14} />
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Save Attribute" : "Add Attribute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
