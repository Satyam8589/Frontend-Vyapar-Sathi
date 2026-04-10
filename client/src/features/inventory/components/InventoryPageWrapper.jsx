'use client';

import React from 'react';
import InventorySidebar from './InventorySidebar';

/**
 * Strict Wrapper - Only Sidebar and children
 */
const InventoryPageWrapper = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Exact Sidebar Snippet */}
      <InventorySidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "15px 20px 20px 0px" }}>
        {children}
      </main>
    </div>
  );
};

export default InventoryPageWrapper;
