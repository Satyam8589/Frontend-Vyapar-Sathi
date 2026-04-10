import React from "react";
import { render } from "@testing-library/react";
import { StorePageProvider } from "@/features/store/context/storePageContext";

// Custom render function that includes providers
const customRender = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <StorePageProvider>{children}</StorePageProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { customRender as render };
