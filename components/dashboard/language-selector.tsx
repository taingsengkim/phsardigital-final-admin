"use client"

import * as React from "react"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import type { Language } from "@/lib/i18n/translations"

export interface LanguageOption {
  code: "KH" | "EN"
  lang: Language
  label: string
  flagSrc: string
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "EN",
    lang: "en",
    label: "English (EN)",
    flagSrc: "/Flag_of_the_United_Kingdom.svg",
  },
  {
    code: "KH",
    lang: "kh",
    label: "ខ្មែរ (KH)",
    flagSrc: "/Flag_of_Cambodia.svg",
  },
]

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedLang = LANGUAGES.find((l) => l.lang === language) ?? LANGUAGES[0]

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-gray-50/90 hover:bg-gray-100/90 px-3 h-9 sm:h-10 rounded-2xl border border-gray-200/80 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6338f6]/30 transition-all cursor-pointer shadow-2xs"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedLang.flagSrc}
          alt={selectedLang.code}
          className="w-5 h-3.5 object-cover rounded-xs border border-gray-200 shadow-2xs shrink-0"
        />
        <span className="truncate">{selectedLang.code}</span>
        <ChevronDownIcon className={cn("size-3.5 text-gray-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180 text-[#6338f6]")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 z-50 w-40 rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95">
          <div className="space-y-0.5">
            {LANGUAGES.map((item) => {
              const isSelected = item.lang === language
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.lang)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-xs font-bold rounded-xl transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-[#6338f6]/10 text-[#6338f6]"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.flagSrc}
                      alt={item.code}
                      className="w-5 h-3.5 object-cover rounded-xs border border-gray-200 shadow-2xs shrink-0"
                    />
                    {item.label}
                  </span>
                  {isSelected && <CheckIcon className="size-3.5 text-[#6338f6] shrink-0 ml-1" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
