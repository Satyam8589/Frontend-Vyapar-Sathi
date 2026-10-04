"use client";
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function PurchasePaymentModal({ isOpen, onClose, onSubmit, loading, purchase }) {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !purchase) return null;

  const dueAmount = purchase.dueAmount || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;
    if (numAmount > dueAmount) {
      alert("Payment amount cannot exceed the due amount.");
      return;
    }
    
    onSubmit({
      amount: numAmount,
      paymentMode,
      notes,
      date
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Record Payment - #${purchase.invoiceNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 font-medium">Total Due:</span>
            <span className="font-bold text-rose-600">₹{dueAmount}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Payment Amount *
          </label>
          <input
            type="number"
            required
            min="1"
            max={dueAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter amount (max ₹${dueAmount})`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Notes / Reference (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="2"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. UPI Ref Number..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 font-bold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > dueAmount}
            className="px-5 py-2.5 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

