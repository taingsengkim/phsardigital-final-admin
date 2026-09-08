"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useGetSellersQuery } from "@/lib/redux/service/sellerApi"
import type { Seller } from "@/lib/types/seller"
import { formatMediaUrl } from "@/lib/media-url"
import {
  SearchIcon,
  CheckIcon,
  XIcon,
  StoreIcon,
  ChevronDownIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  Edit2Icon,
  ExternalLinkIcon,
} from "lucide-react"

export interface InitialSellerData {
  sellerId?: string
  businessName?: string
  logoUri?: string | null
  phoneNumber?: string | null
  city?: string | null
  isActive?: boolean
}

interface SellerSearchComboboxProps {
  value: string
  onChange: (sellerId: string, seller?: Seller | null) => void
  disabled?: boolean
  initialSeller?: InitialSellerData | null
  placeholder?: string
}

export function SellerSearchCombobox({
  value,
  onChange,
  disabled = false,
  initialSeller,
  placeholder = "Search platform sellers by name, ID, phone...",
}: SellerSearchComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isManualMode, setIsManualMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: sellers = [], isLoading, isFetching } = useGetSellersQuery()

  // Match the currently selected seller object
  const currentSeller = useMemo(() => {
    if (!value) return null
    const found = sellers.find((s) => s.id.toLowerCase() === value.toLowerCase())
    if (found) return found

    if (initialSeller && initialSeller.sellerId?.toLowerCase() === value.toLowerCase()) {
      return {
        id: initialSeller.sellerId,
        name: initialSeller.businessName || "Untitled Seller",
        store: initialSeller.businessName || "-",
        email: "",
        phone: initialSeller.phoneNumber || "",
        verification: "Verified",
        plan: "—",
        listings: 0,
        rating: null,
        reviews: null,
        sales: "",
        status: initialSeller.isActive !== false ? "ACTIVE" : "SUSPENDED",
        avatar: initialSeller.logoUri || null,
        location: initialSeller.city || "",
        completedOrders: 0,
      } as Seller
    }

    return null
  }, [value, sellers, initialSeller])

  // Filter sellers by search query
  const filteredSellers = useMemo(() => {
    if (!searchQuery.trim()) return sellers
    const q = searchQuery.toLowerCase().trim()
    return sellers.filter((seller) => {
      const name = seller.name?.toLowerCase() || ""
      const store = seller.store?.toLowerCase() || ""
      const id = seller.id?.toLowerCase() || ""
      const phone = seller.phone?.toLowerCase() || ""
      const loc = seller.location?.toLowerCase() || ""
      const email = seller.email?.toLowerCase() || ""
      return (
        name.includes(q) ||
        store.includes(q) ||
        id.includes(q) ||
        phone.includes(q) ||
        loc.includes(q) ||
        email.includes(q)
      )
    })
  }, [sellers, searchQuery])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close dropdown on Escape key
  useEffect(() => {
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

  const handleSelect = (seller: Seller) => {
    onChange(seller.id, seller)
    setSearchQuery("")
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("", null)
    setSearchQuery("")
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleUseCustomId = (customId: string) => {
    const trimmed = customId.trim()
    if (!trimmed) return
    onChange(trimmed, null)
    setSearchQuery("")
    setIsOpen(false)
  }

  // 1. If in manual UUID input mode
  if (isManualMode && !disabled) {
    return (
      <div className="space-y-1.5">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value, null)}
            placeholder="e.g. 7c324310-8bbf-4c7b-99f4-0b1a03980123"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl h-11 px-3.5 text-sm font-mono text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6338f6]/30 focus:border-[#6338f6] transition-all"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("", null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Direct UUID entry mode</span>
          <button
            type="button"
            onClick={() => setIsManualMode(false)}
            className="text-[#6338f6] font-semibold hover:underline"
          >
            Switch to platform seller search
          </button>
        </div>
      </div>
    )
  }

  // 2. If a seller is currently selected (or locked in disabled edit mode)
  if (value && currentSeller) {
    const avatarUrl = currentSeller.avatar ? formatMediaUrl(currentSeller.avatar) : null
    const displayName = currentSeller.name || currentSeller.store || "Seller"

    return (
      <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-3 flex items-center justify-between gap-3 transition-all hover:border-gray-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6338f6] font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-purple-100 shadow-2xs">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none"
                }}
              />
            ) : (
              <span>{displayName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
              {currentSeller.status === "ACTIVE" ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                  <span className="size-1 rounded-full bg-emerald-500"></span> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
                  <span className="size-1 rounded-full bg-rose-500"></span> Suspended
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
              <span className="font-mono text-[11px] truncate max-w-[170px] sm:max-w-[220px]">
                {currentSeller.id}
              </span>
              {currentSeller.location && (
                <>
                  <span>•</span>
                  <span className="truncate">{currentSeller.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {!disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
            title="Change seller"
          >
            <Edit2Icon size={15} />
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-gray-400 px-2 py-1 bg-white rounded-lg border border-gray-100 shrink-0">
            Fixed
          </span>
        )}
      </div>
    )
  }

  // 3. Fallback if a value was typed/passed but not found in platform sellers
  if (value && !currentSeller && disabled) {
    return (
      <div className="rounded-2xl border border-gray-200/90 bg-gray-50/70 p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller ID</p>
          <p className="text-xs font-mono font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        </div>
        <span className="text-[11px] font-semibold text-gray-400 px-2 py-1 bg-white rounded-lg border border-gray-100 shrink-0">
          Fixed
        </span>
      </div>
    )
  }

  // 4. Default Searchable Combobox Input
  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          {isLoading || isFetching ? (
            <Loader2Icon size={16} className="animate-spin text-[#6338f6]" />
          ) : (
            <SearchIcon size={16} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200/80 rounded-xl h-11 pl-10 pr-10 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6338f6]/30 focus:border-[#6338f6] transition-all"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <XIcon size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <ChevronDownIcon
              size={16}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-[#6338f6]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
          {/* Dropdown Header */}
          <div className="px-3.5 py-2 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>
              Platform Sellers ({filteredSellers.length}
              {sellers.length > 0 && filteredSellers.length !== sellers.length
                ? ` of ${sellers.length}`
                : ""}
              )
            </span>
            <button
              type="button"
              onClick={() => {
                setIsManualMode(true)
                setIsOpen(false)
              }}
              className="text-[#6338f6] hover:underline text-[11px]"
            >
              Enter UUID manually
            </button>
          </div>

          {/* List of Sellers */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 p-1">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                <Loader2Icon size={20} className="animate-spin text-[#6338f6]" />
                <span>Loading sellers from platform...</span>
              </div>
            ) : filteredSellers.length > 0 ? (
              filteredSellers.map((seller) => {
                const avatarUrl = seller.avatar ? formatMediaUrl(seller.avatar) : null
                const displayName = seller.name || seller.store || "Seller"
                const isSelected = seller.id === value

                return (
                  <div
                    key={seller.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(seller)}
                    className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#6338f6]/10 text-[#6338f6]"
                        : "hover:bg-purple-50/60 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6338f6] font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-purple-100">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none"
                            }}
                          />
                        ) : (
                          <span>{displayName.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {displayName}
                          </span>
                          {seller.status === "ACTIVE" ? (
                            <span className="inline-block size-1.5 rounded-full bg-emerald-500 shrink-0" />
                          ) : (
                            <span className="inline-block size-1.5 rounded-full bg-rose-500 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 truncate">
                          <span className="font-mono">{seller.id.slice(0, 10)}...</span>
                          {seller.location && (
                            <>
                              <span>•</span>
                              <span className="truncate">{seller.location}</span>
                            </>
                          )}
                          {seller.phone && (
                            <>
                              <span>•</span>
                              <span>{seller.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckIcon size={16} className="text-[#6338f6] shrink-0 ml-2" />
                    )}
                  </div>
                )
              })
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-xs text-gray-500">
                  No sellers found matching &quot;{searchQuery}&quot;
                </p>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleUseCustomId(searchQuery)}
                    className="mt-2 text-xs font-semibold text-[#6338f6] hover:underline"
                  >
                    Use &quot;{searchQuery.trim()}&quot; as custom Seller ID
                  </button>
                )}
              </div>
            )}
          </div>

          {/* If there's a search query and results exist, still offer custom ID option at bottom */}
          {searchQuery.trim() && filteredSellers.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => handleUseCustomId(searchQuery)}
                className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-[#6338f6] hover:bg-white rounded-lg transition-colors font-medium flex items-center justify-between"
              >
                <span>Or use typed text as custom ID</span>
                <span className="font-mono text-[11px] text-gray-400">
                  {searchQuery.trim().slice(0, 14)}...
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
