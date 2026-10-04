import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getPurchaseReports } from '../services/purchaseService';

export const usePurchaseReports = () => {
  const { storeId } = useParams();
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    supplierId: '',
    productId: '',
    paymentStatus: '',
    returnStatus: ''
  });

  const fetchReports = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError('');
      const data = await getPurchaseReports(storeId, currentFilters);
      setReportData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return {
    storeId,
    reportData,
    loading,
    error,
    filters,
    setFilters,
    fetchReports
  };
};
