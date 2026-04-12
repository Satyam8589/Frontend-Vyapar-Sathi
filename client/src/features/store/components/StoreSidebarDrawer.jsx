"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { X } from "lucide-react";
import { useStorePageContext } from "@/features/store/context/storePageContext";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";

const icons = {
  Inventory: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Billing: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <line x1="9" y1="8" x2="11" y2="8" />
    </svg>
  ),
  Staff: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Analytics: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H17" />
      <path d="M22 10v4" />
      <path d="M2 10v4" />
    </svg>
  ),
  "AI Dashboard": (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="9" r="1" />
      <circle cx="9" cy="15" r="1" />
      <circle cx="15" cy="15" r="1" />
    </svg>
  ),
  Overview: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Settings: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  ),
  "Billing History": (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
};

function NavLink({ label, href, icon, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6.5px 11px",
          borderRadius: 10,
          border: "none",
          background: active ? "#2563eb" : "transparent",
          color: active ? "#fff" : "#7a97be",
          fontWeight: active ? 600 : 400,
          fontSize: 13.5,
          fontFamily: "'Segoe UI', sans-serif",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.13s, color 0.13s",
          marginBottom: 0.5,
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.background = "#223350";
            e.currentTarget.style.color = "#b8d0ef";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#7a97be";
          }
        }}
      >
        <span style={{ opacity: 0.75, flexShrink: 0, display: "flex" }}>
          {icon}
        </span>
        <span style={{ whiteSpace: "nowrap" }}>{label}</span>
      </div>
    </Link>
  );
}

export default function StoreSidebarDrawer() {
  const pathname = usePathname();
  const params = useParams();
  const { user } = useAuth();
  const storeId = params?.storeId;
  const { storeSidebarOpen, setStoreSidebarOpen } = useStorePageContext();
  const { currentStore } = useInventoryContext();
  const [showFullName, setShowFullName] = useState(false);

  const getStoreInitials = (name) => {
    if (!name) return "VS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = () => {
    setStoreSidebarOpen(false);
  };

  const navItems = [
    {
      label: "Overview",
      href: `/storeDashboard/${storeId}/overview`,
      key: "overview",
    },
    {
      label: "Inventory",
      href: `/storeDashboard/${storeId}`,
      key: "inventory",
    },
    {
      label: "Billing",
      href: `/storeDashboard/${storeId}/billing`,
      key: "billing",
    },
    {
      label: "Billing History",
      href: `/storeDashboard/${storeId}/billing-history`,
      key: "billing-history",
    },
    {
      label: "Staff",
      href: `/storeDashboard/${storeId}/staff`,
      key: "staff",
    },
    {
      label: "Analytics",
      href: `/storeDashboard/${storeId}/analytics`,
      key: "analytics",
    },
    {
      label: "AI Dashboard",
      href: `/storeDashboard/${storeId}/ai-dashboard`,
      key: "ai-dashboard",
    },
  ];

  const getActiveNav = () => {
    if (pathname.includes("/overview")) return "overview";
    if (pathname.includes("/billing-history")) return "billing-history";
    if (pathname.includes("/billing")) return "billing";
    if (pathname.includes("/staff")) return "staff";
    if (pathname.includes("/analytics")) return "analytics";
    if (pathname.includes("/ai-dashboard")) return "ai-dashboard";
    return "inventory";
  };

  const activeNav = getActiveNav();

  const getUserInitials = (displayName) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!storeSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 99,
        }}
        onClick={() => setStoreSidebarOpen(false)}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          left: 0,
          width: 250,
          height: "calc(100vh - 80px)",
          background: "#1b2a42",
          zIndex: 100,
          padding: "16px 12px 12px 12px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
          overflowY: "auto",
          borderRadius: "0 24px 24px 0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setStoreSidebarOpen(false)}
          style={{
            position: "absolute",
            top: 20,
            right: 12,
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#7a97be",
            cursor: "pointer",
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 101,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.color = "#7a97be";
          }}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "#263d5e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#7eb3ff",
              fontFamily: "'Segoe UI', sans-serif",
              flexShrink: 0,
            }}
          >
            {getStoreInitials(currentStore?.name)}
          </div>
          <span
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: 15.5,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: showFullName ? "normal" : "nowrap",
              maxWidth: showFullName ? "100%" : 160,
              cursor: "pointer",
              wordBreak: "break-word",
            }}
            onClick={() => setShowFullName(!showFullName)}
            title={currentStore?.name || "VyaparSathi"}
          >
            <span style={{ color: "#fff" }}>
              {currentStore?.name || "VyaparSathi"}
            </span>
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto" }} className="no-scrollbar">
          {/* Main Dashboard Section */}
          <div style={{ padding: "0 4px", marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4e6580", letterSpacing: "1px", marginBottom: 4, paddingLeft: 8 }}>MAIN DASHBOARD</p>
            {navItems.filter(i => ["overview", "inventory"].includes(i.key)).map((item) => (
              <NavLink
                key={item.key}
                label={item.label}
                href={item.href}
                icon={icons[item.label]}
                active={activeNav === item.key}
                onClick={handleNavClick}
              />
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "0 8px 6px 8px" }}></div>

          {/* Sales Section */}
          <div style={{ padding: "0 4px", marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4e6580", letterSpacing: "1px", marginBottom: 4, paddingLeft: 8 }}>SALES & BILLS</p>
            {navItems.filter(i => ["billing", "billing-history"].includes(i.key)).map((item) => (
              <NavLink
                key={item.key}
                label={item.label}
                href={item.href}
                icon={icons[item.label]}
                active={activeNav === item.key}
                onClick={handleNavClick}
              />
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "0 8px 6px 8px" }}></div>

          {/* Management Section */}
          <div style={{ padding: "0 4px", marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4e6580", letterSpacing: "1px", marginBottom: 4, paddingLeft: 8 }}>MANAGEMENT</p>
            {navItems.filter(i => ["staff", "analytics"].includes(i.key)).map((item) => (
              <NavLink
                key={item.key}
                label={item.label}
                href={item.href}
                icon={icons[item.label]}
                active={activeNav === item.key}
                onClick={handleNavClick}
              />
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "0 8px 6px 8px" }}></div>

          {/* Intelligence Section */}
          <div style={{ padding: "0 4px", marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4e6580", letterSpacing: "1px", marginBottom: 4, paddingLeft: 8 }}>INTELLIGENCE</p>
            {navItems.filter(i => ["ai-dashboard"].includes(i.key)).map((item) => (
              <NavLink
                key={item.key}
                label={item.label}
                href={item.href}
                icon={icons[item.label]}
                active={activeNav === item.key}
                onClick={handleNavClick}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #243454",
            margin: "8px 4px 10px 4px",
          }}
        />

        {/* User */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px 2px 8px",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: user?.photoURL
                ? "transparent"
                : "linear-gradient(135deg, #4a90d9, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Segoe UI', sans-serif",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName || "User"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              getUserInitials(user?.displayName)
            )}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#e6edf7",
                fontFamily: "'Segoe UI', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.displayName || "User"}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "#4e6580",
                fontFamily: "'Segoe UI', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || "N/A"}
            </div>
          </div>
        </div>

        {/* Settings Button */}
        <Link href={`/storeDashboard/${storeId}/settings`}>
          <button
            onClick={handleNavClick}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6.5px 11px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "#7a97be",
              fontWeight: 400,
              fontSize: 13.5,
              fontFamily: "'Segoe UI', sans-serif",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.13s, color 0.13s",
              marginTop: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#223350";
              e.currentTarget.style.color = "#b8d0ef";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#7a97be";
            }}
          >
            <span style={{ opacity: 0.75, flexShrink: 0, display: "flex" }}>
              {icons.Settings}
            </span>
            <span style={{ whiteSpace: "nowrap" }}>Settings</span>
          </button>
        </Link>
      </div>
    </>
  );
}
