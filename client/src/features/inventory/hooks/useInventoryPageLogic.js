import { useMemo, useState } from 'react';
import { useInventoryContext } from '@/features/inventory/context/inventoryContext';

/**
 * Custom hook for managing inventory page logic.
 * Handles filtering, sorting, pagination, and modal actions.
 */
export const useInventoryPageLogic = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryContext();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const lowStockThreshold = 10;

  const normalizeQuantity = (item) => Number(item?.quantity ?? item?.qty ?? 0);

  const categoryOptions = useMemo(() => {
    const categories = new Set(['all']);
    (products || []).forEach((item) => {
      const category = item?.category?.trim();
      if (category) {
        categories.add(category);
      }
    });
    return Array.from(categories);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const base = products || [];

    const filtered = base.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        item?.name?.toLowerCase().includes(normalizedQuery) ||
        item?.barcode?.toLowerCase().includes(normalizedQuery) ||
        item?.brand?.toLowerCase().includes(normalizedQuery) ||
        item?.category?.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === 'all' ||
        (item?.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const qty = normalizeQuantity(item);
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && qty > lowStockThreshold) ||
        (stockFilter === 'low_stock' && qty > 0 && qty <= lowStockThreshold) ||
        (stockFilter === 'out_of_stock' && qty === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    return [...filtered].sort((a, b) => {
      const aName = (a?.name || '').toLowerCase();
      const bName = (b?.name || '').toLowerCase();
      const aQty = normalizeQuantity(a);
      const bQty = normalizeQuantity(b);
      const aPrice = Number(a?.price || 0);
      const bPrice = Number(b?.price || 0);

      switch (sortBy) {
        case 'name-desc':
          return bName.localeCompare(aName);
        case 'stock-asc':
          return aQty - bQty;
        case 'stock-desc':
          return bQty - aQty;
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'name-asc':
        default:
          return aName.localeCompare(bName);
      }
    });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  const totalFilteredCount = filteredAndSortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredAndSortedProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const pageStart = totalFilteredCount === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const pageEnd = Math.min(safeCurrentPage * itemsPerPage, totalFilteredCount);

  const activeFilterCount = [
    searchTerm.trim().length > 0,
    selectedCategory !== 'all',
    stockFilter !== 'all',
    sortBy !== 'name-asc',
    itemsPerPage !== 10,
  ].filter(Boolean).length;

  const categoryProductCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((item) => {
      const key = item?.category || 'General';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [products]);

  const stockCounts = useMemo(() => {
    const counts = {
      all: (products || []).length,
      in_stock: 0,
      low_stock: 0,
      out_of_stock: 0,
    };

    (products || []).forEach((item) => {
      const qty = normalizeQuantity(item);
      if (qty === 0) {
        counts.out_of_stock += 1;
      } else if (qty <= lowStockThreshold) {
        counts.low_stock += 1;
      } else {
        counts.in_stock += 1;
      }
    });

    return counts;
  }, [products]);

  const setValidatedCurrentPage = (page) => {
    const nextPage = Number(page);
    if (!Number.isFinite(nextPage)) return;
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setCurrentPage(clamped);
  };

  // Reset to first page when filter changes
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStockFilterChange = (value) => {
    setStockFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStockFilter('all');
    setSortBy('name-asc');
    setItemsPerPage(10);
    setCurrentPage(1);
  };

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
    return result;
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
    selectedCategory,
    stockFilter,
    sortBy,
    itemsPerPage,
    isAddModalOpen,
    isEditModalOpen,
    editingProduct,
    isDeleteModalOpen,
    productToDelete,
    selectedProduct,
    isDetailModalOpen,
    isSidebarOpen,
    filteredProducts: paginatedProducts,
    currentPage: safeCurrentPage,
    totalPages,
    totalFilteredCount,
    pageStart,
    pageEnd,
    categoryOptions,
    categoryProductCounts,
    stockCounts,
    activeFilterCount,

    // Setters
    setSearchTerm,
    setIsAddModalOpen,
    setCurrentPage: setValidatedCurrentPage,

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
    handleSearchChange,
    handleCategoryChange,
    handleStockFilterChange,
    handleSortChange,
    handleItemsPerPageChange,
    handleResetFilters,
  };
};

export default useInventoryPageLogic;