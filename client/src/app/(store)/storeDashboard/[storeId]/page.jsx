"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  InventoryTable,
  InventoryStats,
  InventoryFilters,
  AddProductModal,
  EditProductModal,
  DeleteConfirmModal,
  ProductDetailModal,
  StoreDetailsSidebar,
} from "@/features/inventory/components";
import {
  InventoryProvider,
  useInventoryContext,
} from "@/features/inventory/context/inventoryContext";

const InventoryContent = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId;
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    products,
    currentStore,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useInventoryContext();

  const threshold = currentStore?.settings?.lowStockThreshold || 10;
  const currencySymbol =
    currentStore?.settings?.currency === "INR"
      ? "₹"
      : currentStore?.settings?.currency || "₹";

  const stats = [
    {
      label: "Total Products",
      value: products?.length.toString() || "0",
      color: "blue",
    },
    {
      label: "Low Stock",
      value:
        products
          ?.filter(
            (p) =>
              (p.quantity || p.qty) <= threshold && (p.quantity || p.qty) > 0,
          )
          .length.toString() || "0",
      color: "amber",
    },
    {
      label: "Out of Stock",
      value:
        products
          ?.filter((p) => (p.quantity || p.qty) === 0)
          .length.toString() || "0",
      color: "red",
    },
    {
      label: "Total Value",
      value: `${currencySymbol}${products?.reduce((acc, p) => acc + p.price * (p.quantity || p.qty || 0), 0).toLocaleString() || "0"}`,
      color: "emerald",
    },
  ];

  const handleEdit = (item) => {
    setEditingProduct(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setProductToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setIsDetailModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      handleCloseDeleteModal();
    }
  };

  const handleAddProduct = async (data) => {
    const result = await addProduct(data);
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  const handleUpdateProduct = async (data) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct._id, data);
      if (result.success) {
        handleCloseEditModal();
      } else {
        alert(result.error);
      }
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col relative antialiased min-h-screen">
      <main className="relative z-10 p-3 md:p-6 max-w-7xl mx-auto w-full">
        {/* Compact Header Section */}
        <section className="mb-4 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
                  {currentStore?.name || "Stock Control"}
                </h1>
                <p className="text-xs text-slate-600 truncate font-semibold">
                  Store ID:{" "}
                  <span className="font-mono text-slate-700">{storeId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => router.push("/storeDashboard")}
                className="px-4 py-2.5 bg-slate-100/80 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-200/80 transition-all shadow-sm flex items-center gap-2 text-sm"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary-yb py-2.5 px-5 shadow-lg flex items-center gap-2 text-sm font-bold"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </section>

        {/* Compact Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-3 text-sm shadow-sm">
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Inventory Stats Summary */}
        <InventoryStats stats={stats} />

        {/* Search and Filters Bar */}
        <InventoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onMenuClick={handleOpenSidebar}
        />

        {/* Inventory Table Area */}
        <InventoryTable
          inventory={
            products?.filter(
              (item) =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.barcode?.includes(searchTerm),
            ) || []
          }
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onProductClick={handleProductClick}
          lowStockThreshold={threshold}
          currencySymbol={currencySymbol}
        />
      </main>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAction={handleAddProduct}
        loading={loading}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateProduct}
        loading={loading}
        product={editingProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
        productName={productToDelete?.name}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        product={selectedProduct}
        currencySymbol={currencySymbol}
      />

      <StoreDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        store={currentStore}
      />
    </div>
  );
};

const InventoryPage = () => {
  return (
    <InventoryProvider>
      <InventoryContent />
    </InventoryProvider>
  );
};

export default InventoryPage;
