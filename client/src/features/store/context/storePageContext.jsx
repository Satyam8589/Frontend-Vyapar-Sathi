"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const StorePageContext = createContext();

export const StorePageProvider = ({ children }) => {
  const [isStorePage, setIsStorePage] = useState(false);
  const [storeSidebarOpen, setStoreSidebarOpen] = useState(false);
  const [hasAutoOpenedOnMobile, setHasAutoOpenedOnMobile] = useState(false);

  const enterStorePage = useCallback(() => {
    setIsStorePage(true);
    // Don't auto-open - let user control sidebar via hamburger
    // This prevents sidebar from opening on every page refresh
  }, []);

  const exitStorePage = useCallback(() => {
    setIsStorePage(false);
    setStoreSidebarOpen(false);
    setHasAutoOpenedOnMobile(false);
  }, []);

  const toggleStoreSidebar = useCallback(() => {
    setStoreSidebarOpen((prev) => !prev);
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
