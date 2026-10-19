"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe, Check, ChevronDown } from "lucide-react";

export default function LanguageSwitcher({
  className = "",
  variant = "dropdown", // "dropdown" | "pills" | "compact"
  align = "right", // "right" | "left"
}) {
  const { locale, setLocale, locales, localeMetadata } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code) => {
    setLocale(code, { redirect: false });
    setIsOpen(false);
  };

  const currentMeta = localeMetadata[locale] || localeMetadata.en;

  // Variant: Segmented Pills (great for Settings page or modals)
  if (variant === "pills") {
    return (
      <div
        role="radiogroup"
        aria-label="Language Selection"
        className={`inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 ${className}`}
      >
        {locales.map((code) => {
          const meta = localeMetadata[code];
          const isSelected = locale === code;
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(code)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <span>{meta.nativeName}</span>
              <span className="text-[10px] text-slate-400 font-normal uppercase">
                ({meta.name})
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: Dropdown menu (default for Navbar and Breadcrumbs)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        id="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language. Current language: ${currentMeta.nativeName}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="font-bold tracking-tight">{currentMeta.nativeName}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="language-switcher-button"
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } mt-2 w-48 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95`}
        >
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Choose Language
          </div>
          {locales.map((code) => {
            const meta = localeMetadata[code];
            const isSelected = locale === code;
            return (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{meta.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {meta.name}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
