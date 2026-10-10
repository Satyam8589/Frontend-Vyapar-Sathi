"use client";

import { useState } from "react";
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
  BulkUploadModal,
} from "@/features/inventory/components";
import {
  useInventoryContext,
} from "@/features/inventory/context/inventoryContext";
import {
  useInventoryPageLogic,
  useInventoryStats,
} from "@/features/inventory/hooks";
import DashboardAlertWidget from "@/features/notification/components/DashboardAlertWidget";

/**
 * Inventory Page Content - Uses hooks for logic separation
 */
const InventoryContent = () => {
  const params = useParams();
  const storeId = params.storeId;
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Get store and products data from context
  const { currentStore, loading, error, setCurrentStore, fetchProducts } =
    useInventoryContext();

  // Use custom hooks for page logic
  const pageLogic = useInventoryPageLogic();
  const { stats, threshold, currencySymbol } = useInventoryStats();

  const handleBulkUploadSuccess = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      <div className="w-full px-1 sm:px-2 md:px-3 py-3 sm:py-4 md:py-6">
        {/* Header Section */}
        <InventoryHeader
          storeId={storeId}
          storeName={currentStore?.name}
          onAddProductClick={() => pageLogic.setIsAddModalOpen(true)}
          onBulkUploadClick={() => setIsBulkModalOpen(true)}
        />

        {/* Error Alert */}
        <InventoryErrorAlert error={error} />

        {/* Dashboard Alert Widget */}
        <DashboardAlertWidget />

        {/* Inventory Stats Summary */}
        <InventoryStats stats={stats} />

        {/* Search and Filters Bar */}
        <InventoryFilters
          searchTerm={pageLogic.searchTerm}
          onSearchChange={pageLogic.handleSearchChange}
          onMenuClick={pageLogic.handleOpenSidebar}
          selectedCategory={pageLogic.selectedCategory}
          onCategoryChange={pageLogic.handleCategoryChange}
          categoryOptions={pageLogic.categoryOptions}
          categoryProductCounts={pageLogic.categoryProductCounts}
          stockFilter={pageLogic.stockFilter}
          onStockFilterChange={pageLogic.handleStockFilterChange}
          stockCounts={pageLogic.stockCounts}
          sortBy={pageLogic.sortBy}
          onSortChange={pageLogic.handleSortChange}
          itemsPerPage={pageLogic.itemsPerPage}
          onItemsPerPageChange={pageLogic.handleItemsPerPageChange}
          totalResults={pageLogic.totalFilteredCount}
          activeFilterCount={pageLogic.activeFilterCount}
          onResetFilters={pageLogic.handleResetFilters}
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
          currentPage={pageLogic.currentPage}
          totalPages={pageLogic.totalPages}
          pageStart={pageLogic.pageStart}
          pageEnd={pageLogic.pageEnd}
          totalFilteredCount={pageLogic.totalFilteredCount}
          onPageChange={pageLogic.setCurrentPage}
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

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        storeId={storeId}
        onUploadSuccess={handleBulkUploadSuccess}
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
 * Inventory Page - Inherits context from root layout
 */
const InventoryPage = () => {
  return <InventoryContent />;
};

export default InventoryPage;

