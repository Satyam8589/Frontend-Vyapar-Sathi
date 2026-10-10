import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getSellerById, getSellerPurchases, getSellerPurchaseSummary, getSellerPayments } from '../services/sellerService';

export const useSellerDetails = () => {
  const { storeId, sellerId } = useParams();

  const [seller, setSeller] = useState(null);
  const [summary, setSummary] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters for purchases
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [returnStatus, setReturnStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSellerDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sellerRes, summaryRes] = await Promise.all([
        getSellerById(storeId, sellerId),
        getSellerPurchaseSummary(storeId, sellerId)
      ]);

      setSeller(sellerRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Error fetching seller details:', err);
      setError(err?.response?.data?.message || 'Failed to load supplier details');
    } finally {
      setLoading(false);
    }
  }, [storeId, sellerId]);

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await getSellerPurchases(storeId, sellerId, {
        page,
        limit: 10,
        search,
        paymentStatus,
        returnStatus
      });

      setPurchases(res.data.purchases);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  }, [storeId, sellerId, page, search, paymentStatus, returnStatus]);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await getSellerPayments(storeId, sellerId, {
        page: 1,
        limit: 50
      });
      setPayments(res.data.payments);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  }, [storeId, sellerId]);

  useEffect(() => {
    if (storeId && sellerId) {
      fetchSellerDetails();
    }
  }, [fetchSellerDetails, storeId, sellerId]);

  useEffect(() => {
    if (storeId && sellerId) {
      fetchPurchases();
      fetchPayments();
    }
  }, [fetchPurchases, fetchPayments, storeId, sellerId]);

  // Handle filter changes (reset to page 1)
  useEffect(() => {
    setPage(1);
  }, [search, paymentStatus, returnStatus]);

  return {
    storeId,
    sellerId,
    seller,
    summary,
    purchases,
    payments,
    loading,
    error,
    search,
    setSearch,
    paymentStatus,
    setPaymentStatus,
    returnStatus,
    setReturnStatus,
    page,
    setPage,
    totalPages,
    total,
    refreshPurchases: fetchPurchases
  };
};
