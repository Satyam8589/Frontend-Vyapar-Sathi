"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const StorePageContext = createContext();

export const StorePageProvider = ({ children }) => {
  const [isStorePage, setIsStorePage] = useState(false);
  const [storeSidebarOpen, setStoreSidebarOpen] = useState(false);
  const [hasAutoOpenedOnMobile, setHasAutoOpenedOnMobile] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotWidth, setCopilotWidthState] = useState(480);
  const [isDraggingCopilot, setIsDraggingCopilot] = useState(false);

  // Load saved width preference from localStorage on mount
  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem("vyapar_copilot_width");
      if (savedWidth) {
        const parsed = parseInt(savedWidth, 10);
        if (parsed >= 360 && parsed <= 1200) {
          setCopilotWidthState(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const setCopilotWidth = useCallback((width) => {
    setCopilotWidthState(width);
    try {
      localStorage.setItem("vyapar_copilot_width", String(width));
    } catch (_) {}
  }, []);

  const enterStorePage = useCallback(() => {
    setIsStorePage(true);
  }, []);

  const exitStorePage = useCallback(() => {
    setIsStorePage(false);
    setStoreSidebarOpen(false);
    setHasAutoOpenedOnMobile(false);
    setCopilotOpen(false);
  }, []);

  const toggleStoreSidebar = useCallback(() => {
    setStoreSidebarOpen((prev) => !prev);
  }, []);

  const toggleCopilot = useCallback(() => {
    setCopilotOpen((prev) => !prev);
  }, []);

  const openCopilot = useCallback(() => {
    setCopilotOpen(true);
  }, []);

  const closeCopilot = useCallback(() => {
    setCopilotOpen(false);
  }, []);

  return (
    <StorePageContext.Provider
      value={{
        isStorePage,
        storeSidebarOpen,
        setStoreSidebarOpen,
        enterStorePage,
        exitStorePage,
        toggleStoreSidebar,
        copilotOpen,
        setCopilotOpen,
        toggleCopilot,
        openCopilot,
        closeCopilot,
        copilotWidth,
        setCopilotWidth,
        isDraggingCopilot,
        setIsDraggingCopilot,
      }}
    >
      {children}
    </StorePageContext.Provider>
  );
};

export const useStorePageContext = () => {
  const context = useContext(StorePageContext);
  if (!context) {
    throw new Error(
      "useStorePageContext must be used within StorePageProvider",
    );
  }
  return context;
};
