import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getBuyers, createBuyer, updateBuyer, deleteBuyer } from '../services/buyerService';
import { useAgentRefresh } from '@/hooks/useAgentRefresh';

export const useBuyerPage = () => {
  const { storeId } = useParams();

  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editBuyer, setEditBuyer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBuyers(storeId, {
        search,
        status: statusFilter,
        page,
        limit: 15,
      });
      setBuyers(data.buyers || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch buyers');
    } finally {
      setLoading(false);
    }
  }, [storeId, search, statusFilter, page]);

  // Auto-refresh when AI agent mutates buyers
  const { refreshKey } = useAgentRefresh('buyers');

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers, refreshKey]);

  const handleAddBuyer = async (data) => {
    try {
      setActionLoading(true);
      await createBuyer(storeId, data);
      setIsAddModalOpen(false);
      fetchBuyers();
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditBuyer = async (data) => {
    if (!editBuyer) return;
    try {
      setActionLoading(true);
      await updateBuyer(storeId, editBuyer._id, data);
      setEditBuyer(null);
      fetchBuyers();
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBuyer = async (buyerId) => {
    if (!window.confirm('Are you sure you want to delete this buyer?')) return;
    try {
      await deleteBuyer(storeId, buyerId);
      fetchBuyers();
    } catch (err) {
      alert(err.message || 'Failed to delete buyer');
    }
  };

  return {
    storeId,
    buyers, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages, total,
    fetchBuyers,
    isAddModalOpen, setIsAddModalOpen,
    editBuyer, setEditBuyer,
    actionLoading,
    handleAddBuyer, handleEditBuyer, handleDeleteBuyer,
  };
};
