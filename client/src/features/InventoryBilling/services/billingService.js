import { apiPost, apiGet, apiPatch } from "@/servies/api";

/**
 * Billing Service - Handles billing and transaction related API calls
 * Uses Cart API endpoints for billing operations
 */

// Fetch product by barcode
export const getProductByBarcode = async (barcode, storeId) => {
  const response = await apiGet(
    `/product/barcode/${barcode}?storeId=${storeId}`,
  );
  return response.data;
};

// Fetch product by manual search (name/ID)
export const searchProductInStore = async (searchTerm, storeId) => {
  const response = await apiGet(
    `/product/search?query=${searchTerm}&storeId=${storeId}`,
  );
  return response.data;
};

// Get store products for manual selection
export const getStoreProducts = async (storeId) => {
  const response = await apiGet(`/product/all?storeId=${storeId}`);
  return response.data;
};

// Create a new billing session (cart)
export const createBillingSession = async (storeId) => {
  const response = await apiPost("/cart/create", { storeId });
  return response.data;
};

// Start scanning mode
export const startScanning = async (cartId) => {
  const response = await apiPatch(`/cart/${cartId}/start-scan`, {});
  return response.data;
};

// Add item to billing session
export const addItemToBill = async (cartId, productId, quantity) => {
  const response = await apiPost(`/cart/${cartId}/items`, {
    productId,
    quantity,
  });
  return response.data;
};

// Process payment (generates bill)
export const processPayment = async (cartId, paymentMethod) => {
  const response = await apiPost(`/cart/${cartId}/payment`, {
    paymentId: `${paymentMethod}-${Date.now()}`,
  });
  return response.data;
};

// Confirm payment and update inventory
export const confirmPayment = async (cartId) => {
  const response = await apiPatch(`/cart/${cartId}/confirm-payment`, {});
  return response.data;
};

// Complete billing flow (create cart, add items, process payment, confirm)
export const generateBill = async (billData) => {
  const { storeId, products, paymentMethod } = billData;

  // Step 1: Create cart
  const cart = await createBillingSession(storeId);

  // Step 2: Start scanning
  await startScanning(cart._id);

  // Step 3: Add all products
  for (const item of products) {
    await addItemToBill(
      cart._id,
      item._id || item.productId,
      item.billedQuantity || item.quantity,
    );
  }

  // Step 4: Process payment
  await processPayment(cart._id, paymentMethod);

  // Step 5: Confirm payment (automatically updates inventory)
  const finalCart = await confirmPayment(cart._id);

  return finalCart;
};

// Get bill history for a store
export const getBillHistory = async (storeId, limit = 50, page = 1) => {
  const response = await apiGet(
    `/cart/store/${storeId}/history?limit=${limit}&page=${page}`,
  );
  return response.data;
};
