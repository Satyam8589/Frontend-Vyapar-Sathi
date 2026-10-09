import { jsPDF } from "jspdf";

/**
 * Helper to check if a value is valid and not empty/N/A
 */
const isValid = (val) => {
  if (val === null || val === undefined) return false;
  const s = String(val).trim();
  return s !== "" && s !== "N/A" && s !== "n/a" && s !== "undefined" && s !== "null";
};

/**
 * Convert number to Indian Rupee words (e.g. 1450 -> "One Thousand Four Hundred Fifty Rupees Only")
 */
const numberToWords = (amount) => {
  const num = Math.floor(Math.abs(amount || 0));
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertGroup = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertGroup(n % 100) : "");
    if (n < 100000) return convertGroup(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convertGroup(n % 1000) : "");
    if (n < 10000000) return convertGroup(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convertGroup(n % 100000) : "");
    return convertGroup(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convertGroup(n % 10000000) : "");
  };

  const words = convertGroup(num);
  const paise = Math.round((Math.abs(amount || 0) - num) * 100);
  const paiseText = paise > 0 ? ` and ${convertGroup(paise)} Paise` : "";

  return `${words}${paiseText} Rupees Only`;
};

/**
 * Format date in Indian Standard Time (DD MMM YYYY, hh:mm A)
 */
const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generate a highly realistic & professional GST Tax Invoice PDF
 * @param {Object} billData - The bill data containing store, products, customer, and payment info
 * @returns {jsPDF} - The generated PDF document
 */
export const generateBillPDF = (billData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = 16;

  // Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const secondaryColor = [71, 85, 105]; // Slate 600
  const lightBg = [248, 250, 252]; // Slate 50

  // Extracted Store Details
  const store = billData.storeInfo || billData.store || {};
  const storeName = store.name || store.storeName || "Vyapar Sakha Store";
  const storeAddress = store.address || store.location || "";
  const storePhone = store.phone || store.mobile || store.contact || "";
  const storeEmail = store.email || "";
  const storeGstin = store.gstin || store.gstNumber || "";

  // Extracted Customer Details
  const customer = billData.customer || billData.buyer || {};
  const customerName = billData.customerName || customer.name || "Walk-in Customer";
  const customerPhone = billData.customerPhone || customer.phone || "";
  const customerEmail = billData.customerEmail || customer.email || "";
  const customerAddress = customer.address || "";

  // Invoice Details
  const invoiceNo = billData.billNumber || billData.invoiceNo || (billData._id ? `INV-${billData._id.slice(-8).toUpperCase()}` : `INV-${Date.now().toString().slice(-6)}`);
  const invoiceDate = formatDate(billData.billedAt || billData.createdAt || billData.date);
  const paymentMethod = (billData.paymentMethod || billData.paymentMode || "CASH").toUpperCase();
  const paymentStatus = (billData.paymentStatus || "PAID").toUpperCase();

  // -------------------------------------------------------------
  // 1. STORE HEADER & TAX INVOICE BADGE (NO UGLY TOP LINE)
  // -------------------------------------------------------------
  // Store Name Title (Top Left)
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(storeName, margin, yPos);

  // TAX INVOICE Badge Header (Top Right)
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - margin - 42, yPos - 6.5, 42, 9, 2, 2, "F");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageWidth - margin - 21, yPos - 0.5, { align: "center" });

  yPos += 5.5;

  // Store Address Line (if valid)
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);

  if (isValid(storeAddress)) {
    doc.text(`${storeAddress}`, margin, yPos);
    yPos += 4;
  }

  // Store Phone / Email Line (if valid)
  const contactParts = [];
  if (isValid(storePhone)) contactParts.push(`Phone: ${storePhone}`);
  if (isValid(storeEmail)) contactParts.push(`Email: ${storeEmail}`);
  if (contactParts.length > 0) {
    doc.text(contactParts.join(" | "), margin, yPos);
    yPos += 4;
  }

  // Store GSTIN Line (if valid)
  if (isValid(storeGstin)) {
    doc.setFont("helvetica", "bold");
    doc.text(`GSTIN / Registration No: ${storeGstin}`, margin, yPos);
    yPos += 4;
  }

  // Divider Line Below Store Header
  yPos += 2;
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  // -------------------------------------------------------------
  // 2. 2-COLUMN METADATA BOX (INVOICE DETAILS & BILLED TO)
  // -------------------------------------------------------------
  // Build customer valid field list to dynamically set height
  const customerFields = [];
  if (isValid(customerName)) customerFields.push({ label: "Name", value: customerName });
  if (isValid(customerPhone)) customerFields.push({ label: "Phone", value: customerPhone });
  if (isValid(customerEmail)) customerFields.push({ label: "Email", value: customerEmail });
  if (isValid(customerAddress)) customerFields.push({ label: "Address", value: customerAddress });

  const invoiceLineCount = 3 + (isValid(storePhone) ? 1 : 0) + (isValid(storeEmail) ? 1 : 0);
  const lineCount = Math.max(invoiceLineCount, customerFields.length);
  const boxHeight = 12 + lineCount * 4.5;
  const colWidth = (pageWidth - margin * 2 - 4) / 2;

  // Left Box: Invoice Meta Details
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, yPos, colWidth, boxHeight, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, yPos, colWidth, boxHeight, 2, 2, "D");

  let leftY = yPos + 5;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("INVOICE DETAILS", margin + 4, leftY);

  leftY += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text("Invoice No:", margin + 4, leftY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(invoiceNo, margin + 22, leftY);

  leftY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text(`Date & Time: ${invoiceDate}`, margin + 4, leftY);

  leftY += 4.5;
  doc.text(`Payment Mode: ${paymentMethod}`, margin + 4, leftY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52); // Green
  doc.text(` [${paymentStatus}]`, margin + 42, leftY);

  if (isValid(storePhone)) {
    leftY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Store Ph: ${storePhone}`, margin + 4, leftY);
  }

  if (isValid(storeEmail)) {
    leftY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Store Email: ${storeEmail}`, margin + 4, leftY);
  }

  // Right Box: Billed To Customer Details
  const rightX = margin + colWidth + 4;
  doc.setFillColor(...lightBg);
  doc.roundedRect(rightX, yPos, colWidth, boxHeight, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(rightX, yPos, colWidth, boxHeight, 2, 2, "D");

  let rightY = yPos + 5;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("BILLED TO (CUSTOMER)", rightX + 4, rightY);

  rightY += 5;
  doc.setFontSize(8);

  customerFields.forEach((field, i) => {
    doc.setFont("helvetica", i === 0 ? "bold" : "normal");
    doc.setTextColor(i === 0 ? primaryColor[0] : secondaryColor[0], i === 0 ? primaryColor[1] : secondaryColor[1], i === 0 ? primaryColor[2] : secondaryColor[2]);
    doc.text(`${field.label}: ${field.value}`, rightX + 4, rightY);
    rightY += 4.5;
  });

  yPos += boxHeight + 7;

  // -------------------------------------------------------------
  // 3. ITEM TABLE (S.No, ITEM NAME, QTY, UNIT PRICE, TOTAL)
  // -------------------------------------------------------------
  const tableWidth = pageWidth - margin * 2;
  const colX = {
    sno: margin + 3,
    item: margin + 14,
    qty: margin + 95,
    price: margin + 120,
    gst: margin + 148,
    total: pageWidth - margin - 4,
  };

  // Table Header Background
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, tableWidth, 8, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("#", colX.sno, yPos + 5.5);
  doc.text("ITEM DESCRIPTION", colX.item, yPos + 5.5);
  doc.text("QTY", colX.qty, yPos + 5.5, { align: "center" });
  doc.text("RATE (Rs.)", colX.price, yPos + 5.5, { align: "right" });
  doc.text("GST", colX.gst, yPos + 5.5, { align: "center" });
  doc.text("AMOUNT (Rs.)", colX.total, yPos + 5.5, { align: "right" });

  yPos += 8;

  // Table Body Rows
  let subtotal = 0;
  const products = billData.products || billData.items || [];

  products.forEach((item, idx) => {
    // Pagination check
    if (yPos > pageHeight - 45) {
      doc.addPage();
      yPos = margin + 10;
    }

    const name = item.name || item.product?.name || item.title || "Product Item";
    const qty = Number(item.quantity || item.qty || 1);
    const price = Number(item.price || item.unitPrice || item.product?.price || 0);
    const lineTotal = Number(item.total || (qty * price));
    const gstRate = item.gstRate || billData.gstRate || 0;

    subtotal += lineTotal;

    // Alternating Row Background
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, tableWidth, 7, "F");
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);

    // S.No
    doc.text((idx + 1).toString(), colX.sno, yPos + 4.8);

    // Item Name Truncation
    let displayName = name;
    if (doc.getTextWidth(displayName) > 75) {
      while (doc.getTextWidth(displayName + "...") > 75 && displayName.length > 0) {
        displayName = displayName.slice(0, -1);
      }
      displayName += "...";
    }
    doc.text(displayName, colX.item, yPos + 4.8);

    // Qty
    doc.text(qty.toString(), colX.qty, yPos + 4.8, { align: "center" });

    // Rate
    doc.text(price.toFixed(2), colX.price, yPos + 4.8, { align: "right" });

    // GST
    doc.text(gstRate > 0 ? `${gstRate}%` : "0%", colX.gst, yPos + 4.8, { align: "center" });

    // Amount
    doc.setFont("helvetica", "bold");
    doc.text(lineTotal.toFixed(2), colX.total, yPos + 4.8, { align: "right" });

    yPos += 7;
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  // -------------------------------------------------------------
  // 4. SUMMARY & TOTAL CALCULATIONS
  // -------------------------------------------------------------
  const totalAmount = Number(billData.totalAmount || billData.totalPrice || subtotal);
  const discount = Number(billData.discount || 0);
  const gstTaxAmount = Number(billData.taxAmount || billData.gstAmount || 0);

  const summaryLeftX = margin;
  const summaryRightX = pageWidth - margin - 75;

  // Total in Words Box (Left Side)
  doc.setFillColor(...lightBg);
  doc.roundedRect(summaryLeftX, yPos, 90, 22, 2, 2, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(summaryLeftX, yPos, 90, 22, 2, 2, "D");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...secondaryColor);
  doc.text("AMOUNT IN WORDS:", summaryLeftX + 3, yPos + 5);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);

  const amountWords = numberToWords(totalAmount);
  const splitWords = doc.splitTextToSize(amountWords, 84);
  doc.text(splitWords, summaryLeftX + 3, yPos + 10);

  // Financial Figures Table (Right Side)
  let figY = yPos + 4;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);

  doc.text("Subtotal:", summaryRightX, figY);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, pageWidth - margin, figY, { align: "right" });

  if (discount > 0) {
    figY += 4.5;
    doc.text("Discount:", summaryRightX, figY);
    doc.text(`- Rs. ${discount.toFixed(2)}`, pageWidth - margin, figY, { align: "right" });
  }

  if (gstTaxAmount > 0) {
    figY += 4.5;
    doc.text("GST Tax:", summaryRightX, figY);
    doc.text(`+ Rs. ${gstTaxAmount.toFixed(2)}`, pageWidth - margin, figY, { align: "right" });
  }

  // Grand Total Highlight Banner
  figY += 6;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(summaryRightX - 2, figY - 4, 77, 8, 2, 2, "F");

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("GRAND TOTAL:", summaryRightX + 2, figY + 1.5);
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, pageWidth - margin - 2, figY + 1.5, { align: "right" });

  yPos += 28;

  // -------------------------------------------------------------
  // 5. TERMS & CONDITIONS & AUTHORIZED SIGNATORY
  // -------------------------------------------------------------
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Terms & Conditions:", margin, yPos);

  yPos += 4;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text("1. All sales are final. Goods once sold will not be returned or exchanged.", margin, yPos);
  yPos += 3.5;
  doc.text("2. Payments received via cash/UPI/cards as indicated on this receipt.", margin, yPos);
  yPos += 3.5;
  doc.text("3. This is a computer-generated official tax invoice.", margin, yPos);

  // Authorized Signatory Box Right
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - margin - 45, yPos - 2, pageWidth - margin, yPos - 2);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("For " + storeName, pageWidth - margin - 22.5, yPos + 2, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Authorized Signatory", pageWidth - margin - 22.5, yPos + 5.5, { align: "center" });

  // -------------------------------------------------------------
  // 6. FOOTER WATERMARK
  // -------------------------------------------------------------
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for shopping with us! Visit again!", pageWidth / 2, pageHeight - 7, { align: "center" });

  return doc;
};

/**
 * Download bill as PDF file
 */
export const downloadBillPDF = (billData, filename) => {
  const doc = generateBillPDF(billData);
  const billId = billData.billNumber || billData._id?.slice(-8) || "INVOICE";
  const defaultFilename = `Tax_Invoice_${billId}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename || defaultFilename);
};

/**
 * Print bill PDF
 */
export const printBillPDF = (billData) => {
  const doc = generateBillPDF(billData);
  doc.autoPrint();
  window.open(doc.output("bloburl"), "_blank");
};

/**
 * Get PDF as blob
 */
export const getBillPDFBlob = (billData) => {
  const doc = generateBillPDF(billData);
  return doc.output("blob");
};
