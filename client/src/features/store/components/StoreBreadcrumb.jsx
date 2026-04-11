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
    <div
      style={{
        position: "sticky",
        top: "80px",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        gap: "10px",
        marginBottom: "14px",
        padding: "10px 12px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
      }}
    >
      {isResponsive && (
        <button
          type="button"
          onClick={toggleStoreSidebar}
          aria-label="Open sidebar"
          aria-expanded={storeSidebarOpen}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "34px",
            height: "34px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            cursor: "pointer",
            flexShrink: 0,
          }}
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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          fontSize: "14px",
          color: "#334155",
          minWidth: 0,
          flex: 1,
          width: 0,
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div
              key={`${crumb.label}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  style={{
                    fontWeight: 500,
                    color: "#475569",
                    textDecoration: "none",
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  style={{
                    fontWeight: isLast ? 600 : 500,
                    color: isLast ? "#0f172a" : "#475569",
                  }}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast && <span style={{ color: "#94a3b8" }}>/</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
