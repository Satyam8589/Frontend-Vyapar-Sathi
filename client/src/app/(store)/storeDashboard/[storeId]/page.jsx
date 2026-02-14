'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InventoryTable, InventoryStats, InventoryFilters, AddProductModal, DeleteConfirmModal, ProductDetailModal } from '@/features/inventory/components';
import { InventoryProvider, useInventoryContext } from '@/features/inventory/context/inventoryContext';

const InventoryContent = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { 
    products, 
    currentStore,
    loading, 
    error, 
    addProduct, 
    updateProduct,
    deleteProduct 
  } = useInventoryContext();

  const threshold = currentStore?.settings?.lowStockThreshold || 10;
  const currencySymbol = currentStore?.settings?.currency === 'INR' ? '₹' : (currentStore?.settings?.currency || '₹');

  const stats = [
    { label: 'Total Products', value: products?.length.toString() || '0', color: 'blue' },
    { label: 'Low Stock', value: products?.filter(p => (p.quantity || p.qty) <= threshold && (p.quantity || p.qty) > 0).length.toString() || '0', color: 'amber' },
    { label: 'Out of Stock', value: products?.filter(p => (p.quantity || p.qty) === 0).length.toString() || '0', color: 'red' },
    { label: 'Total Value', value: `${currencySymbol}${products?.reduce((acc, p) => acc + (p.price * (p.quantity || p.qty || 0)), 0).toLocaleString() || '0'}`, color: 'emerald' },
  ];

  const handleEdit = (item) => {
    setEditingProduct(item);
    setIsModalOpen(true);
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

  const handleModalAction = async (data) => {
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct._id, data);
    } else {
      result = await addProduct(data);
    }

    if (result.success) {
      handleCloseModal();
    } else {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
    <div className="flex flex-col relative antialiased min-h-screen">
      <main className="relative z-10 p-4 md:p-8">
        {/* Header Section */}
        <section className="mb-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/90 shadow-sm backdrop-blur-sm mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Inventory Systems</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                {currentStore?.name || 'Stock Control'}
              </h1>
              <p className="mt-4 text-lg text-slate-600 font-bold italic">
                Real-time inventory assets for <span className="text-blue-600 not-italic select-all">{currentStore?.name || `Store ${storeId}`}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/storeDashboard')}
                className="px-6 py-4 bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 group shadow-sm"
              >
                <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary-yb py-4 px-8 shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
              >
                <svg className="h-5 w-5 transform group-hover:scale-110 transition-transform font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-black uppercase tracking-widest text-xs md:text-sm">Add Product</span>
              </button>
            </div>
          </div>
        </section>

        {/* Global Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Inventory Stats Summary */}
        <InventoryStats stats={stats} />

        {/* Search and Filters Bar */}
        <InventoryFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Inventory Table Area */}
        <InventoryTable 
          inventory={products?.filter(item => 
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode?.includes(searchTerm)
          ) || []}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onProductClick={handleProductClick}
          lowStockThreshold={threshold}
          currencySymbol={currencySymbol}
        />
      </main>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onAction={handleModalAction}
        loading={loading}
        editingProduct={editingProduct}
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
