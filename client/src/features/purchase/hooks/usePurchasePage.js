import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getPurchases, createPurchase, getPurchaseById, updatePurchase, deletePurchase } from '../services/purchaseService';

export const usePurchasePage = () => {
  const { storeId } = useParams();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPurchases(storeId, {
        search,
        paymentStatus: paymentStatusFilter,
        page,
        limit: 10
      });
      setPurchases(data.purchases || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [storeId, search, paymentStatusFilter, page]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleAddPurchase = async (data) => {
    try {
      setActionLoading(true);
      await createPurchase(storeId, data);
      setIsAddModalOpen(false);
      fetchPurchases();
      // Optional: Add toast success here if react-hot-toast is set up
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    storeId,
    purchases,
    loading,
    error,
    search, setSearch,
    paymentStatusFilter, setPaymentStatusFilter,
    page, setPage,
    totalPages, total,
    fetchPurchases,
    isAddModalOpen, setIsAddModalOpen,
    actionLoading, handleAddPurchase
  };
};
