"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

/**
 * ProductActionMenu Component
 * Kabab menu (⋮) with a portal-rendered dropdown for edit and delete actions.
 * Portal ensures the dropdown renders on <body> directly — no overflow/z-index clipping from table parents.
 *
 * @param {Function} onEdit   - Callback when Edit is clicked
 * @param {Function} onDelete - Callback when Delete is clicked
 */
const ProductActionMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate dropdown position from the trigger button's bounding rect
  const openMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,       // fixed = viewport-relative, no scrollY needed
        left: rect.right - 144,     // align right edge of 144px menu to trigger's right
      });
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  // Close on scroll (position would drift)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const dropdown = isOpen
    ? ReactDOM.createPortal(
        <div
          ref={menuRef}
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed z-[999] w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-scale-up"
        >
          <button
            onClick={() => { setIsOpen(false); onEdit?.(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <div className="border-t border-slate-100 mx-2" />
          <button
            onClick={() => { setIsOpen(false); onDelete?.(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {/* Kabab trigger button */}
      <button
        ref={triggerRef}
        onClick={openMenu}
        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
        title="More actions"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {dropdown}
    </>
  );
};

export default ProductActionMenu;
