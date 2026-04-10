'use client';

import { useState } from "react";

const icons = {
  Dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Inventory: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Orders: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/><line x1="9" y1="8" x2="11" y2="8"/></svg>,
  Products: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Staff: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Reports: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  "Help & Support": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const navItems = ["Dashboard", "Inventory", "Orders", "Products", "Staff", "Reports"];
const managementItems = ["Settings", "Help & Support"];

function NavBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 11px",
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
        marginBottom: 1,
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#223350"; e.currentTarget.style.color = "#b8d0ef"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7a97be"; } }}
    >
      <span style={{ opacity: active ? 1 : 0.75, flexShrink: 0, display: "flex" }}>{icons[label]}</span>
      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}

export default function VyaparSathiSidebar() {
  const [active, setActive] = useState("Inventory");

  return (
    <div style={{ padding: "16px 20px 20px 24px", minWidth: 258 }}>
      <div style={{
        width: 214,
        height: "calc(100vh - 125px)",
        background: "#1b2a42",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        padding: "15px 12px 14px 12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 1.5px 6px rgba(0,0,0,0.13)",
        position: "fixed",
        top: 95,
        left: 24,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "2px 6px 16px 6px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "#263d5e",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#7eb3ff",
            fontFamily: "'Segoe UI', sans-serif", flexShrink: 0,
          }}>VS</div>
          <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 15.5, fontWeight: 700 }}>
            <span style={{ color: "#fff" }}>Vyapar</span>
            <span style={{ color: "#f5a623" }}>Sathi</span>
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto" }} className="no-scrollbar">
          {navItems.map(label => (
            <NavBtn key={label} label={label} active={active === label} onClick={() => setActive(label)} />
          ))}

          <div style={{
            fontSize: 10.5, fontWeight: 600, color: "#3e5573",
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: "'Segoe UI', sans-serif",
            padding: "16px 11px 5px 11px",
          }}>Management</div>

          {managementItems.map(label => (
            <NavBtn key={label} label={label} active={active === label} onClick={() => setActive(label)} />
          ))}
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid #243454", margin: "10px 4px 12px 4px" }} />

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 2px 8px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #4a90d9, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
            fontFamily: "'Segoe UI', sans-serif", flexShrink: 0,
          }}>SA</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#e6edf7", fontFamily: "'Segoe UI', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Satyam Agarwal
            </div>
            <div style={{ fontSize: 10.5, color: "#4e6580", fontFamily: "'Segoe UI', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              satyam@example.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
