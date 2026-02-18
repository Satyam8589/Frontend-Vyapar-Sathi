import { useState } from 'react';
import { useInventoryContext } from '@/features/inventory/context/inventoryContext';

/**
 * Custom hook for managing inventory page logic
 * Handles all state management and event handlers
 */
export const useInventoryPageLogic = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryContext();

  // Modal and UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter products based on search term
  const filteredProducts = products?.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode?.includes(searchTerm)
  ) || [];

  // Handle edit product
  const handleEdit = (item) => {
    setEditingProduct(item);
    setIsEditModalOpen(true);
  };

  // Handle delete product
  const handleDelete = (item) => {
    setProductToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handle product detail view
  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setIsDetailModalOpen(true);
  };

  // Confirm and execute deletion
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      handleCloseDeleteModal();
    }
  };

  // Add new product
  const handleAddProduct = async (data) => {
    const result = await addProduct(data);
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  // Update existing product
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

  // Close edit modal and reset state
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  // Close delete modal and reset state
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Close detail modal and reset state
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  // Sidebar handlers
  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return {
    // State
    searchTerm,
    isAddModalOpen,
    isEditModalOpen,
    editingProduct,
    isDeleteModalOpen,
    productToDelete,
    selectedProduct,
    isDetailModalOpen,
    isSidebarOpen,
    filteredProducts,

    // Setters
    setSearchTerm,
    setIsAddModalOpen,

    // Handlers
    handleEdit,
    handleDelete,
    handleProductClick,
    handleConfirmDelete,
    handleAddProduct,
    handleUpdateProduct,
    handleCloseEditModal,
    handleCloseDeleteModal,
    handleCloseDetailModal,
    handleOpenSidebar,
    handleCloseSidebar,
  };
};

export default useInventoryPageLogic;
