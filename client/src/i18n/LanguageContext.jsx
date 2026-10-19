"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_METADATA,
  isValidLocale,
  getLocaleFromPath,
  stripLocaleFromPath,
  localizePath,
  formatCurrency as utilFormatCurrency,
  formatNumber as utilFormatNumber,
  formatDate as utilFormatDate,
} from "./config";
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";
import bnMessages from "@/messages/bn.json";
import { apiPut } from "@/servies/api";

const MESSAGES_MAP = {
  en: enMessages,
  hi: hiMessages,
  bn: bnMessages,
};

const LanguageContext = createContext(null);

/**
 * Get cookie value by name
 */
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Set persistent cookie with 1 year expiry
 */
function setCookie(name, value, days = 365) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Deep resolve string from nested JSON dictionary (e.g. "inventory.stockQuantity")
 */
function resolveNestedKey(obj, path) {
  if (!obj || !path) return undefined;
  const keys = path.split(".");
  let current = obj;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Interpolate {var} parameters inside translated text
 */
function interpolate(template, params = {}) {
  if (!template || typeof template !== "string") return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Initial locale resolution priority:
  //    URL path segment -> Cookie -> LocalStorage -> Browser Language -> Default (en)
  const initialLocale = useMemo(() => {
    // Check URL path
    const urlLoc = getLocaleFromPath(pathname);
    if (isValidLocale(urlLoc)) return urlLoc;

    if (typeof window !== "undefined") {
      // Check Cookie
      const cookieLoc = getCookie("NEXT_LOCALE");
      if (isValidLocale(cookieLoc)) return cookieLoc;

      // Check LocalStorage
      const storedLoc = localStorage.getItem("preferredLanguage");
      if (isValidLocale(storedLoc)) return storedLoc;

      // Check Navigator Language
      const navLang = navigator.language?.slice(0, 2)?.toLowerCase();
      if (isValidLocale(navLang)) return navLang;
    }

    return DEFAULT_LOCALE;
  }, [pathname]);

  const [locale, setLocaleState] = useState(initialLocale);

  // Synchronize document.documentElement.lang and document direction
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = LOCALE_METADATA[locale]?.dir || "ltr";
    }
  }, [locale]);

  // Handle language change
  const setLocale = useCallback(
    async (newLocale, { redirect = false } = {}) => {
      if (!isValidLocale(newLocale)) return;

      setLocaleState(newLocale);

      // Persist in Cookie
      setCookie("NEXT_LOCALE", newLocale, 365);

      // Persist in LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredLanguage", newLocale);
      }

      // Sync with MongoDB backend user profile if token is present
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (token) {
        try {
          await apiPut("/auth/profile", { preferredLanguage: newLocale });
        } catch {
          // Ignore offline or guest sync errors
        }
      }

      // If URL has locale prefix or redirect is requested, adjust route
      const currentUrlLocale = getLocaleFromPath(pathname);
      if (currentUrlLocale || redirect) {
        const targetPath = localizePath(pathname, newLocale);
        if (targetPath !== pathname) {
          router.push(targetPath);
        }
      }
    },
    [pathname, router]
  );

  // Translation function with fallback
  const t = useCallback(
    (key, params = {}) => {
      const activeDict = MESSAGES_MAP[locale] || MESSAGES_MAP[DEFAULT_LOCALE];
      const fallbackDict = MESSAGES_MAP[DEFAULT_LOCALE];

      // 1. Try active locale
      let val = resolveNestedKey(activeDict, key);

      // 2. Fall back to English
      if (val === undefined && locale !== DEFAULT_LOCALE) {
        val = resolveNestedKey(fallbackDict, key);
      }

      // 3. Fall back to raw key if not found in any dictionary
      if (val === undefined) {
        return key;
      }

      return interpolate(val, params);
    },
    [locale]
  );

  // Formatting helpers bound to current locale
  const formatCurrency = useCallback(
    (amount) => utilFormatCurrency(amount, locale),
    [locale]
  );

  const formatNumber = useCallback(
    (value) => utilFormatNumber(value, locale),
    [locale]
  );

  const formatDate = useCallback(
    (date, options) => utilFormatDate(date, locale, options),
    [locale]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      formatCurrency,
      formatNumber,
      formatDate,
      locales: SUPPORTED_LOCALES,
      localeMetadata: LOCALE_METADATA,
      defaultLocale: DEFAULT_LOCALE,
    }),
    [locale, setLocale, t, formatCurrency, formatNumber, formatDate]
  );

  const messages = MESSAGES_MAP[locale] || MESSAGES_MAP[DEFAULT_LOCALE];

  return (
    <LanguageContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

/**
 * Primary custom hook to access language state and formatting
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, params = {}) => {
        const val = resolveNestedKey(MESSAGES_MAP[DEFAULT_LOCALE], key) || key;
        return interpolate(val, params);
      },
      formatCurrency: (val) => utilFormatCurrency(val, DEFAULT_LOCALE),
      formatNumber: (val) => utilFormatNumber(val, DEFAULT_LOCALE),
      formatDate: (val, opt) => utilFormatDate(val, DEFAULT_LOCALE, opt),
      locales: SUPPORTED_LOCALES,
      localeMetadata: LOCALE_METADATA,
      defaultLocale: DEFAULT_LOCALE,
    };
  }
  return context;
}

/**
 * Convenient shorthand hook for translations:
 * const { t } = useTranslation();
 * t('common.save');
 */
export function useTranslation() {
  const { t, locale, formatCurrency, formatNumber, formatDate } = useLanguage();
  return { t, locale, formatCurrency, formatNumber, formatDate };
}
