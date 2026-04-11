"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorePageContext } from "@/features/store/context/storePageContext";

const formatSegmentLabel = (segment) =>
  decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function StoreBreadcrumb({ isResponsive = false }) {
  const pathname = usePathname();
  const { toggleStoreSidebar, storeSidebarOpen } = useStorePageContext();

  const allSegments = pathname.split("/").filter(Boolean);
  const storeDashboardIndex = allSegments.indexOf("storeDashboard");

  if (storeDashboardIndex === -1 || !allSegments[storeDashboardIndex + 1]) {
    return null;
  }

  const storeId = allSegments[storeDashboardIndex + 1];
  const pageSegments = allSegments.slice(storeDashboardIndex + 2);

  const breadcrumbs = [
    {
      label: "Store Dashboard",
      href: `/storeDashboard/${storeId}`,
    },
  ];

  if (pageSegments.length === 0) {
    breadcrumbs.push({ label: "Inventory", href: null });
  } else {
    let cumulativePath = `/storeDashboard/${storeId}`;

    pageSegments.forEach((segment, index) => {
      cumulativePath += `/${segment}`;
      breadcrumbs.push({
        label: formatSegmentLabel(segment),
        href: index === pageSegments.length - 1 ? null : cumulativePath,
      });
    });
  }

  return (
    <div className="sticky top-20 z-40 w-full mb-3.5">
      {/* Opaque layer that blocks content from showing behind breadcrumb while scrolling */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-2 -top-2.5 -bottom-2.5 rounded-2x"
      />

      <div className="relative flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
        {isResponsive && (
          <button
            type="button"
            onClick={toggleStoreSidebar}
            aria-label="Open sidebar"
            aria-expanded={storeSidebarOpen}
            className="inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-100"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 w-0 flex-1 flex-wrap items-center gap-2 text-sm text-slate-700"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="font-medium text-slate-600 no-underline transition-colors hover:text-blue-700"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "font-semibold text-slate-900"
                        : "font-medium text-slate-600"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && <span className="text-slate-400">/</span>}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
