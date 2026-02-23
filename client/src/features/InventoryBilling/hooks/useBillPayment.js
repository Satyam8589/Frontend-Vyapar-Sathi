import { useState, useCallback } from "react";
import { useBillingContext } from "../context/billingContext";

/**
 * Custom hook for bill processing and payment
 */
export const useBillPayment = () => {
  const { processBill, calculateTotal, billedProducts } = useBillingContext();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);
  const [showBillPreview, setShowBillPreview] = useState(false);

  const handlePayment = useCallback(async () => {
    setIsProcessing(true);
    const bill = await processBill(paymentMethod);

    if (bill) {
      setGeneratedBill(bill);
      setShowBillPreview(true);
    }

    setIsProcessing(false);
  }, [paymentMethod, processBill]);

  const printBill = useCallback(() => {
    if (!generatedBill) return;

    // Create a printable bill
    const printWindow = window.open("", "_blank");
    const billHTML = generateBillHTML(generatedBill);

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
  }, [generatedBill]);

  const closeBillPreview = useCallback(() => {
    setShowBillPreview(false);
    setGeneratedBill(null);
  }, []);

  return {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    handlePayment,
    generatedBill,
    showBillPreview,
    printBill,
    closeBillPreview,
    totalAmount: calculateTotal(),
    itemCount: billedProducts.length,
  };
};

// Helper function to generate bill HTML
const generateBillHTML = (bill) => {
  const { products, totalAmount, billNumber, billedAt, storeInfo } = bill;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bill #${billNumber || "N/A"}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 300px;
          margin: 20px auto;
          padding: 10px;
        }
        .header {
          text-align: center;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .store-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .bill-info {
          font-size: 11px;
          margin: 5px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        th {
          border-bottom: 1px solid #000;
          padding: 5px 0;
          text-align: left;
          font-size: 11px;
        }
        td {
          padding: 5px 0;
          font-size: 11px;
        }
        .right {
          text-align: right;
        }
        .total-section {
          border-top: 2px solid #000;
          margin-top: 10px;
          padding-top: 10px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          border-top: 2px dashed #000;
          padding-top: 10px;
          font-size: 11px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">${storeInfo?.name || "Store Name"}</div>
        <div class="bill-info">Bill #: ${billNumber || "N/A"}</div>
        <div class="bill-info">Date: ${new Date(billedAt).toLocaleString()}</div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="right">Qty</th>
            <th class="right">Price</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (p) => `
            <tr>
              <td>${p.name}</td>
              <td class="right">${p.quantity}</td>
              <td class="right">₹${p.price.toFixed(2)}</td>
              <td class="right">₹${p.total.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="total-section">
        <table>
          <tr>
            <td>Total Items:</td>
            <td class="right">${products.length}</td>
          </tr>
          <tr>
            <td>Total Amount:</td>
            <td class="right">₹${totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div class="footer">
        Thank you for your purchase!<br>
        Visit us again!
      </div>
    </body>
    </html>
  `;
};
