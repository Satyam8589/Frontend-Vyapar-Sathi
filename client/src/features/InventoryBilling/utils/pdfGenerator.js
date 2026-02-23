import { jsPDF } from "jspdf";

/**
 * Generate a professional PDF bill
 * @param {Object} billData - The bill data containing all necessary information
 * @returns {jsPDF} - The generated PDF document
 */
export const generateBillPDF = (billData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // ===== HEADER SECTION =====
  // Company Name/Logo
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 78, 121); // Professional blue color
  doc.text("Vyapar Sathi", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Invoice / Bill of Sale", pageWidth / 2, yPosition, {
    align: "center",
  });

  // Horizontal line
  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  yPosition += 10;

  // ===== BILL INFO SECTION =====
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);

  // Left side - Bill details
  doc.text("Bill Details:", 15, yPosition);
  yPosition += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Bill ID: #${billData._id?.slice(-12) || "N/A"}`, 15, yPosition);
  yPosition += 5;
  doc.text(
    `Date: ${formatDate(billData.updatedAt || billData.createdAt)}`,
    15,
    yPosition,
  );
  yPosition += 5;
  doc.text(
    `Payment Method: ${billData.paymentMethod || "Cash"}`,
    15,
    yPosition,
  );
  yPosition += 5;
  doc.text(
    `Payment Status: ${billData.paymentStatus || "Paid"}`,
    15,
    yPosition,
  );

  // Right side - Customer details (if available)
  yPosition -= 20; // Reset to align with left side
  if (billData.user || billData.customerPhone) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Customer Details:", pageWidth - 80, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (billData.user?.name) {
      doc.text(`Name: ${billData.user.name}`, pageWidth - 80, yPosition);
      yPosition += 5;
    }
    if (billData.user?.email) {
      doc.text(`Email: ${billData.user.email}`, pageWidth - 80, yPosition);
      yPosition += 5;
    }
    if (billData.customerPhone) {
      doc.text(`Phone: ${billData.customerPhone}`, pageWidth - 80, yPosition);
      yPosition += 5;
    }
  }

  yPosition = Math.max(yPosition + 10, 80); // Ensure consistent spacing

  // ===== ITEMS TABLE SECTION =====
  // Table header background
  doc.setFillColor(31, 78, 121);
  doc.rect(15, yPosition, pageWidth - 30, 8, "F");

  // Table headers
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Item", 18, yPosition + 5);
  doc.text("Qty", pageWidth - 70, yPosition + 5);
  doc.text("Price", pageWidth - 50, yPosition + 5);
  doc.text("Total", pageWidth - 25, yPosition + 5, { align: "right" });

  yPosition += 10;

  // Table rows
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  let subtotal = 0;

  billData.products.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition - 4, pageWidth - 30, 7, "F");
    }

    const productName = item.product?.name || item.name || "Unknown Product";
    const quantity = item.quantity || 1;
    const price = item.product?.price || item.price || 0;
    const total = quantity * price;
    subtotal += total;

    // Product name (with truncation if too long)
    const maxNameWidth = pageWidth - 90;
    let displayName = productName;
    if (doc.getTextWidth(displayName) > maxNameWidth) {
      while (
        doc.getTextWidth(displayName + "...") > maxNameWidth &&
        displayName.length > 0
      ) {
        displayName = displayName.slice(0, -1);
      }
      displayName += "...";
    }
    doc.text(displayName, 18, yPosition);

    doc.text(quantity.toString(), pageWidth - 70, yPosition);
    doc.text(`Rs. ${price.toFixed(2)}`, pageWidth - 50, yPosition);
    doc.text(`Rs. ${total.toFixed(2)}`, pageWidth - 18, yPosition, {
      align: "right",
    });

    yPosition += 7;
  });

  // Horizontal line after items
  yPosition += 3;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 8;

  // ===== TOTALS SECTION =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  // Subtotal
  doc.text("Subtotal:", pageWidth - 70, yPosition);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, pageWidth - 18, yPosition, {
    align: "right",
  });

  yPosition += 6;

  // Tax (if applicable) - assuming 0% for now, can be customized
  const taxRate = 0; // Can be passed from billData if needed
  const taxAmount = subtotal * taxRate;
  if (taxRate > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(
      `Tax (${(taxRate * 100).toFixed(0)}%):`,
      pageWidth - 70,
      yPosition,
    );
    doc.text(`Rs. ${taxAmount.toFixed(2)}`, pageWidth - 18, yPosition, {
      align: "right",
    });
    yPosition += 6;
  }

  // Total
  const grandTotal = billData.totalPrice || subtotal + taxAmount;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 78, 121);

  // Total background
  doc.setFillColor(240, 248, 255);
  doc.rect(pageWidth - 75, yPosition - 4, 60, 10, "F");

  doc.text("Total:", pageWidth - 70, yPosition + 2);
  doc.text(`Rs. ${grandTotal.toFixed(2)}`, pageWidth - 18, yPosition + 2, {
    align: "right",
  });

  // ===== FOOTER SECTION =====
  yPosition = pageHeight - 30;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  yPosition += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your business!", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 5;
  doc.setFont("helvetica", "normal");
  doc.text(
    "Generated by Vyapar Sathi Billing System",
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  yPosition += 4;
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  return doc;
};

/**
 * Download bill as PDF file
 * @param {Object} billData - The bill data
 * @param {string} filename - Optional custom filename
 */
export const downloadBillPDF = (billData, filename) => {
  const doc = generateBillPDF(billData);
  const billId = billData._id?.slice(-8) || "XXXXXXXX";
  const defaultFilename = `Bill_${billId}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename || defaultFilename);
};

/**
 * Print bill PDF
 * @param {Object} billData - The bill data
 */
export const printBillPDF = (billData) => {
  const doc = generateBillPDF(billData);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

/**
 * Get PDF as blob for sharing (e.g., via WhatsApp Web API if available)
 * @param {Object} billData - The bill data
 * @returns {Blob} - PDF blob
 */
export const getBillPDFBlob = (billData) => {
  const doc = generateBillPDF(billData);
  return doc.output("blob");
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
