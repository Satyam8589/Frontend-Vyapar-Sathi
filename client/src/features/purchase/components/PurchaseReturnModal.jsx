"use client";
import { useState, useMemo, useEffect } from "react";

export default function PurchaseReturnModal({ isOpen, onClose, onSubmit, loading, purchase }) {
  const [returnItems, setReturnItems] = useState({});
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const returnReasons = [
    'Damaged Product',
    'Defective Product',
    'Wrong Product',
    'Expired Product',
    'Excess Quantity',
    'Supplier Issue',
    'Other'
  ];

  // Reset form state every time the modal is opened with a new purchase
  useEffect(() => {
    if (isOpen) {
      setReturnItems({});
      setReason("");
      setNotes("");
    }
  }, [isOpen, purchase?._id]);

  const handleQtyChange = (productId, val, maxReturnable) => {
    let newQty = parseInt(val, 10);
    if (isNaN(newQty)) newQty = 0;
    if (newQty < 0) newQty = 0;
    if (newQty > maxReturnable) newQty = maxReturnable;

    setReturnItems(prev => ({
      ...prev,
      [productId]: newQty
    }));
  };

  const selectedItems = useMemo(() => {
    return Object.entries(returnItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ product: id, quantity: qty }));
  }, [returnItems]);

  const summary = useMemo(() => {
    let totalItems = 0;
    let totalReturnQuantity = 0;
    let estimatedReturnAmount = 0;

    selectedItems.forEach(item => {
      const pi = purchase?.items?.find(p => p.product?._id === item.product);
      if (pi) {
        totalItems++;
        totalReturnQuantity += item.quantity;
        estimatedReturnAmount += item.quantity * pi.purchasePrice;
      }
    });

    return { totalItems, totalReturnQuantity, estimatedReturnAmount };
  }, [selectedItems, purchase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    if (!reason) return;
    
    if (!window.confirm(
      `Are you sure you want to return ${summary.totalReturnQuantity} unit(s) of ${summary.totalItems} product(s)?\n\nEstimated return amount: ₹${summary.estimatedReturnAmount.toLocaleString('en-IN')}`
    )) {
      return;
    }
    
    onSubmit({
      items: selectedItems,
      reason,
      notes
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen || !purchase) return null;

  // Check if purchase is fully returned — nothing left to return
  const allFullyReturned = purchase.items?.every(
    item => (item.returnedQuantity || 0) >= item.quantity
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-rose-50 rounded-t-2xl">
          <div>
            <h2 id="return-modal-title" className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
              </svg>
              RETURN PURCHASE
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Stock will be decreased by the returned quantity
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
            aria-label="Close return modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Purchase Info Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Purchase Invoice</p>
              <p className="font-bold text-slate-900 mt-0.5">{purchase.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Supplier</p>
              <p className="font-bold text-slate-900 mt-0.5">{purchase.seller?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Purchase Date</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {new Date(purchase.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Fully Returned State */}
          {allFullyReturned ? (
            <div className="text-center py-10 bg-rose-50 rounded-xl border border-rose-100">
              <svg className="w-12 h-12 text-rose-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-700 font-bold text-lg">All Items Fully Returned</p>
              <p className="text-slate-500 text-sm mt-1">There are no more items eligible for return on this purchase.</p>
            </div>
          ) : (
            <>
              {/* Items Table */}
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b pb-2 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
                Select Items To Return
              </h3>
              
              <div className="overflow-x-auto mb-6 rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-right">Purchased</th>
                      <th className="px-4 py-3 text-right">Already Returned</th>
                      <th className="px-4 py-3 text-right">Returnable</th>
                      <th className="px-4 py-3 text-center">Return Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {purchase.items.map(item => {
                      const productId = item.product?._id;
                      const purchased = item.quantity;
                      const returned = item.returnedQuantity || 0;
                      const returnable = purchased - returned;
                      const currentReturnQty = returnItems[productId] || 0;

                      return (
                        <tr
                          key={productId}
                          className={returnable === 0 ? "opacity-50 bg-slate-50/80" : "hover:bg-slate-50/50"}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            <div>{item.product?.name}</div>
                            {item.product?.sku && (
                              <div className="text-xs text-slate-400 font-mono">{item.product.sku}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600">{purchased}</td>
                          <td className="px-4 py-3 text-right font-medium text-rose-600">{returned}</td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-700">{returnable}</td>
                          <td className="px-4 py-3 text-center">
                            {returnable > 0 ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  aria-label="Decrease return quantity"
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 font-bold flex items-center justify-center transition-colors"
                                  onClick={() => handleQtyChange(productId, currentReturnQty - 1, returnable)}
                                  disabled={currentReturnQty <= 0}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  aria-label={`Return quantity for ${item.product?.name}`}
                                  className="w-16 text-center border border-slate-200 rounded-lg p-1.5 text-sm font-semibold focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none"
                                  value={currentReturnQty}
                                  onChange={(e) => handleQtyChange(productId, e.target.value, returnable)}
                                  min={0}
                                  max={returnable}
                                />
                                <button
                                  type="button"
                                  aria-label="Increase return quantity"
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-600 font-bold flex items-center justify-center transition-colors"
                                  onClick={() => handleQtyChange(productId, currentReturnQty + 1, returnable)}
                                  disabled={currentReturnQty >= returnable}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Fully Returned
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Reason & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label
                    htmlFor="return-reason"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Return Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="return-reason"
                    className="w-full border border-slate-200 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none bg-white"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="">Select Reason</option>
                    {returnReasons.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {!reason && selectedItems.length > 0 && (
                    <p className="text-xs text-rose-500 mt-1">Please select a return reason.</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="return-notes"
                    className="block text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="return-notes"
                    rows={2}
                    placeholder="e.g. 3 packets damaged during delivery..."
                    className="w-full border border-slate-200 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Return Summary */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${selectedItems.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                  <h3 className="font-bold text-slate-800">Return Summary</h3>
                  <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                    <p>
                      Products selected: <span className="font-semibold text-slate-800">{summary.totalItems}</span>
                    </p>
                    <p>
                      Total return quantity: <span className="font-semibold text-slate-800">{summary.totalReturnQuantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Est. Return Amount</p>
                  <p className={`text-2xl font-black ${selectedItems.length > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    ₹{summary.estimatedReturnAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {selectedItems.length === 0 && (
                <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Select at least one item to return.
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {!allFullyReturned && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || selectedItems.length === 0 || !reason}
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 border border-transparent rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing Return...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm Return
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

