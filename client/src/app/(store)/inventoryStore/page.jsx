'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryTable, InventoryStats, InventoryFilters, AddProductModal } from '@/features/inventory/components';
import { MOCK_INVENTORY } from '@/features/inventory/constants';

const InventoryStore = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'Total Products', value: '158', color: 'blue' },
    { label: 'Low Stock', value: '12', color: 'amber' },
    { label: 'Out of Stock', value: '4', color: 'red' },
    { label: 'Total Value', value: '₹1,12,450', color: 'emerald' },
  ];

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (id) => {
    console.log('Delete item ID:', id);
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
                Stock Control
              </h1>
              <p className="mt-4 text-lg text-slate-600 font-bold italic">
                Monitor and manage your real-time inventory assets across the network.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary-yb py-4 px-8 shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
            >
              <svg className="h-5 w-5 transform group-hover:scale-110 transition-transform font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-black uppercase tracking-widest">Add New Product</span>
            </button>
          </div>
        </section>

        {/* Inventory Stats Summary */}
        <InventoryStats stats={stats} />

        {/* Search and Filters Bar */}
        <InventoryFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Inventory Table Area */}
        <InventoryTable 
          inventory={MOCK_INVENTORY.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.barcode.includes(searchTerm)
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={(data) => console.log('New Asset Data:', data)}
      />
    </div>
  );
};

export default InventoryStore;