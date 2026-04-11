"use client";

import { useParams } from "next/navigation";
import {
  InventoryTable,
  InventoryStats,
  InventoryFilters,
  AddProductModal,
  EditProductModal,
  DeleteConfirmModal,
  ProductDetailModal,
  StoreDetailsSidebar,
  InventoryHeader,
  InventoryErrorAlert,
} from "@/features/inventory/components";
import {
  InventoryProvider,
  useInventoryContext,
} from "@/features/inventory/context/inventoryContext";
import {
  useInventoryPageLogic,
  useInventoryStats,
} from "@/features/inventory/hooks";

/**
 * Inventory Page Content - Uses hooks for logic separation
 */
const InventoryContent = () => {
  const params = useParams();
  const storeId = params.storeId;

  // Get store and products data from context
  const { currentStore, loading, error, setCurrentStore } =
    useInventoryContext();

  // Use custom hooks for page logic
  const pageLogic = useInventoryPageLogic();
  const { stats, threshold, currencySymbol } = useInventoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-blue-50/20 pb-8 sm:pb-12">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <InventoryHeader
          storeId={storeId}
          storeName={currentStore?.name}
          onAddProductClick={() => pageLogic.setIsAddModalOpen(true)}
        />

        {/* Error Alert */}
        <InventoryErrorAlert error={error} />

        {/* Inventory Stats Summary */}
        <InventoryStats stats={stats} />

        {/* Search and Filters Bar */}
        <InventoryFilters
          searchTerm={pageLogic.searchTerm}
          setSearchTerm={pageLogic.setSearchTerm}
          onMenuClick={pageLogic.handleOpenSidebar}
        />

        {/* Inventory Table Area */}
        <InventoryTable
          inventory={pageLogic.filteredProducts}
          loading={loading}
          onEdit={pageLogic.handleEdit}
          onDelete={pageLogic.handleDelete}
          onProductClick={pageLogic.handleProductClick}
          lowStockThreshold={threshold}
          currencySymbol={currencySymbol}
        />

        <StoreDetailsSidebar
          isOpen={pageLogic.isSidebarOpen}
          onClose={pageLogic.handleCloseSidebar}
          store={currentStore}
          onStoreUpdated={(updatedStore) => setCurrentStore(updatedStore)}
        />
      </div>

      {/* Modals - Outside container for proper positioning */}
      <AddProductModal
        isOpen={pageLogic.isAddModalOpen}
        onClose={() => pageLogic.setIsAddModalOpen(false)}
        onAction={pageLogic.handleAddProduct}
        loading={loading}
      />

      <EditProductModal
        isOpen={pageLogic.isEditModalOpen}
        onClose={pageLogic.handleCloseEditModal}
        onUpdate={pageLogic.handleUpdateProduct}
        loading={loading}
        product={pageLogic.editingProduct}
      />

      <DeleteConfirmModal
        isOpen={pageLogic.isDeleteModalOpen}
        onClose={pageLogic.handleCloseDeleteModal}
        onConfirm={pageLogic.handleConfirmDelete}
        loading={loading}
        productName={pageLogic.productToDelete?.name}
      />

      <ProductDetailModal
        isOpen={pageLogic.isDetailModalOpen}
        onClose={pageLogic.handleCloseDetailModal}
        product={pageLogic.selectedProduct}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

/**
 * Inventory Page - Wrapped with context provider
 */
const InventoryPage = () => {
  return (
    <InventoryProvider>
      <InventoryContent />
    </InventoryProvider>
  );
};

export default InventoryPage;
