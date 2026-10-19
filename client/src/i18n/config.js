/**
 * i18n Configuration and Formatting Utilities for Vyapar Sathi
 * Supported initial locales: English (en), Hindi (hi), Bengali (bn)
 * Extensible for Marathi, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese.
 */

export const SUPPORTED_LOCALES = ["en", "hi", "bn"];
export const DEFAULT_LOCALE = "en";

export const LOCALE_METADATA = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    intLocale: "en-IN",
    flag: "🇬🇧",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    dir: "ltr",
    intLocale: "hi-IN",
    flag: "🇮🇳",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    dir: "ltr",
    intLocale: "bn-IN",
    flag: "🇧🇩",
  },
};

/**
 * Validate whether a locale string is supported
 */
export function isValidLocale(locale) {
  return typeof locale === "string" && SUPPORTED_LOCALES.includes(locale.toLowerCase());
}

/**
 * Extract locale from URL pathname if prefixed: /hi/storeDashboard -> 'hi'
 */
export function getLocaleFromPath(pathname) {
  if (!pathname || typeof pathname !== "string") return null;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0].toLowerCase())) {
    return segments[0].toLowerCase();
  }
  return null;
}

/**
 * Strip locale prefix from path: /hi/storeDashboard -> /storeDashboard
 */
export function stripLocaleFromPath(pathname) {
  if (!pathname || typeof pathname !== "string") return "/";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0].toLowerCase())) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/**
 * Construct localized path: localizePath('/storeDashboard', 'hi') -> '/hi/storeDashboard'
 */
export function localizePath(pathname, locale = DEFAULT_LOCALE) {
  const cleanPath = stripLocaleFromPath(pathname);
  if (!isValidLocale(locale) || locale === DEFAULT_LOCALE) {
    return cleanPath;
  }
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Format currency strictly in INR with Indian number grouping
 * e.g. 125000 -> "₹1,25,000"
 */
export function formatCurrency(amount, locale = DEFAULT_LOCALE) {
  const num = typeof amount === "number" ? amount : Number(amount) || 0;
  const intlLoc = LOCALE_METADATA[locale]?.intLocale || "en-IN";
  try {
    return new Intl.NumberFormat(intlLoc, {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `₹${num.toLocaleString("en-IN")}`;
  }
}

/**
 * Format standard number with Indian grouping (e.g. 1,25,000)
 */
export function formatNumber(value, locale = DEFAULT_LOCALE) {
  const num = typeof value === "number" ? value : Number(value) || 0;
  const intlLoc = LOCALE_METADATA[locale]?.intLocale || "en-IN";
  try {
    return new Intl.NumberFormat(intlLoc).format(num);
  } catch {
    return num.toLocaleString("en-IN");
  }
}

/**
 * Format date localized according to Indian conventions
 */
export function formatDate(dateInput, locale = DEFAULT_LOCALE, options = {}) {
  if (!dateInput) return "";
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const intlLoc = LOCALE_METADATA[locale]?.intLocale || "en-IN";
  const defaultOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  };

  try {
    return new Intl.DateTimeFormat(intlLoc, defaultOptions).format(d);
  } catch {
    return d.toLocaleDateString("en-IN");
  }
}
