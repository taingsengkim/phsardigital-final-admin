"use client"

import * as React from "react"
import { translations, type Language, type TranslationKey } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "phsardigital_admin_lang"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("en")

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null
      if (saved === "en" || saved === "kh") {
        setLanguageState(saved)
      }
    } catch (e) {
      console.warn("Failed to load language from localStorage", e)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch (e) {
      console.warn("Failed to save language to localStorage", e)
    }
  }

  const t = (key: TranslationKey): string => {
    const dict = translations[language] as Record<TranslationKey, string>
    return dict[key] ?? translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = React.useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
