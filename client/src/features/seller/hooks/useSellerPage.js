"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getSellers,
  getSellerStats,
  createSeller,
  updateSeller,
  deleteSeller,
} from "../services/sellerService";

/**
 * Custom hook for Seller page state and logic
 */
export function useSellerPage() {
  const params = useParams();
  const storeId = params?.storeId;

  // List state
  const [sellers, setSellers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch sellers
  const fetchSellers = useCallback(async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getSellers(storeId, {
        search,
        status: statusFilter,
        page,
        limit: LIMIT,
      });
      setSellers(result.sellers || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err?.message || "Failed to load sellers");
    } finally {
      setLoading(false);
    }
  }, [storeId, search, statusFilter, page]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!storeId) return;
    try {
      setStatsLoading(true);
      const result = await getSellerStats(storeId);
      setStats(result);
    } catch {
      // Non-critical — silently fail
    } finally {
      setStatsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleAddSeller = async (data) => {
    try {
      setActionLoading(true);
      await createSeller(storeId, data);
      toast.success("Seller added successfully!");
      setIsAddModalOpen(false);
      fetchSellers();
      fetchStats();
    } catch (err) {
      toast.error(err?.message || "Failed to add seller");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSeller = async (data) => {
    try {
      setActionLoading(true);
      await updateSeller(storeId, selectedSeller._id, data);
      toast.success("Seller updated successfully!");
      setIsEditModalOpen(false);
      setSelectedSeller(null);
      fetchSellers();
      fetchStats();
    } catch (err) {
      toast.error(err?.message || "Failed to update seller");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSeller = async () => {
    try {
      setActionLoading(true);
      await deleteSeller(storeId, selectedSeller._id);
      toast.success("Seller deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedSeller(null);
      fetchSellers();
      fetchStats();
    } catch (err) {
      toast.error(err?.message || "Failed to delete seller");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (seller) => {
    setSelectedSeller(seller);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (seller) => {
    setSelectedSeller(seller);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (seller) => {
    setSelectedSeller(seller);
    setIsDetailModalOpen(true);
  };

  return {
    storeId,
    sellers,
    stats,
    loading,
    statsLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter: (v) => { setStatusFilter(v); setPage(1); },
    page,
    setPage,
    totalPages,
    total,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedSeller,
    setSelectedSeller,
    actionLoading,
    handleAddSeller,
    handleEditSeller,
    handleDeleteSeller,
    openEditModal,
    openDeleteModal,
    openDetailModal,
  };
}
