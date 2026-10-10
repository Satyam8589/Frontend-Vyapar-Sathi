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
 * Safely format store address with pin code
 */
const formatStoreAddressWithPin = (store) => {
  if (!store) return "";
  let addr = store.address || store.location || store.fullAddress || "";
  let pincode = store.pincode || store.pinCode || store.zipCode || store.zip || "";

  if (typeof addr === "object" && addr !== null) {
    if (addr.pincode) pincode = addr.pincode;
    if (addr.fullAddress) {
      addr = addr.fullAddress;
    } else {
      const parts = [addr.street, addr.city, addr.state, addr.country].filter(isValid);
      addr = parts.join(", ");
    }
  }

  addr = String(addr || "").trim();
  pincode = String(pincode || "").trim();

  if (isValid(addr) && isValid(pincode) && !addr.includes(pincode)) {
    return `${addr} - ${pincode}`;
  }
  if (isValid(addr)) return addr;
  if (isValid(pincode)) return `PIN: ${pincode}`;
  return "";
};

const getStorePhone = (store, billData) => {
  return (
    store?.phone ||
    store?.mobile ||
    store?.contact ||
    store?.owner?.phone ||
    billData?.storePhone ||
    ""
  );
};

const getStoreEmail = (store, billData) => {
  return (
    store?.email ||
    store?.storeEmail ||
    store?.owner?.email ||
    billData?.storeEmail ||
    ""
  );
};

const getDiscountAmount = (billData, subtotal = 0) => {
  if (!billData) return 0;

  // 1. Direct discount object with amount or value
  if (typeof billData.discount === "object" && billData.discount !== null) {
    if (typeof billData.discount.amount === "number" && billData.discount.amount > 0) {
      return billData.discount.amount;
    }
    if (typeof billData.discount.value === "number" && billData.discount.value > 0) {
      if (billData.discount.type === "percent") {
        return (subtotal * billData.discount.value) / 100;
      }
      return billData.discount.value;
    }
  }

  // 2. Direct numeric discount or discountAmount
  if (typeof billData.discount === "number" && billData.discount > 0) {
    return billData.discount;
  }
  if (typeof billData.discountAmount === "number" && billData.discountAmount > 0) {
    return billData.discountAmount;
  }

  // 3. Math calculation fallback (Subtotal - Total)
  const total = Number(billData.totalAmount || billData.totalPrice || 0);
  if (subtotal > 0 && total > 0 && subtotal - total > 0.01) {
    return subtotal - total;
  }

  return 0;
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

  // Extracted Store Details (supports object or fallback properties)
  const storeObj =
    (billData.storeInfo && typeof billData.storeInfo === "object" ? billData.storeInfo : null) ||
    (billData.store && typeof billData.store === "object" ? billData.store : null) ||
    (billData.currentStore && typeof billData.currentStore === "object" ? billData.currentStore : null) ||
    {};

  const storeName = storeObj.name || storeObj.storeName || billData.storeName || "Vyapar Sakha Store";
  const storeAddressStr = formatStoreAddressWithPin(storeObj) || formatStoreAddressWithPin(billData);
  const storePhone = getStorePhone(storeObj, billData);
  const storeEmail = getStoreEmail(storeObj, billData);
  const storeGstin = storeObj.gstin || storeObj.gstNumber || billData.storeGstin || billData.gstin || "";

  // Extracted Customer Details
  const customer = billData.customer || billData.buyer || {};
  const customerName = billData.customerName || customer.name || "Walk-in Customer";
  const customerPhone = billData.customerPhone || customer.phone || "";
  const customerEmail = billData.customerEmail || customer.email || "";
  const customerAddress = customer.address || "";

  // Invoice Details
  const invoiceNo = billData.billNumber || billData.invoiceNo || (billData._id ? `INV-${String(billData._id).slice(-8).toUpperCase()}` : `INV-${Date.now().toString().slice(-6)}`);
  const invoiceDate = formatDate(billData.billedAt || billData.createdAt || billData.date);
  const rawPaymentMethod =
    billData.paymentMethod ||
    billData.paymentMode ||
    (billData.paymentId && typeof billData.paymentId === "string" ? billData.paymentId.split("-")[0] : null) ||
    "CASH";
  const paymentMethod = String(rawPaymentMethod).toUpperCase();
  const paymentStatus = (billData.paymentStatus || "PAID").toUpperCase();

  // -------------------------------------------------------------
  // 1. STORE HEADER & TAX INVOICE BADGE (NO UGLY TOP LINE)
  // -------------------------------------------------------------
  // Store Name Title (Top Left)
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(storeName, margin, yPos);

  // TAX INVOICE Badge Header (Top Right)
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - margin - 42, yPos - 5.5, 42, 9, 2, 2, "F");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageWidth - margin - 21, yPos - 0.5, { align: "center" });

  yPos += 5.5;

  // Store Address & PIN Line (Just below store name)
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);

  if (isValid(storeAddressStr)) {
    doc.text(storeAddressStr, margin, yPos);
    yPos += 4;
  }

  // Store Phone & Email Line
  const contactParts = [];
  if (isValid(storePhone)) contactParts.push(`Phone: ${storePhone}`);
  if (isValid(storeEmail)) contactParts.push(`Email: ${storeEmail}`);
  if (contactParts.length > 0) {
    doc.text(contactParts.join("  |  "), margin, yPos);
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

  const invoiceLineCount = 3; // Invoice No, Date & Time, Payment Mode & Status
  const lineCount = Math.max(invoiceLineCount, customerFields.length);
  const boxHeight = 12 + lineCount * 4.5;
  const colWidth = (pageWidth - margin * 2 - 4) / 2;

  // Left Box: Invoice Meta Details (Store Ph & Email kept strictly at top header)
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

    const name = item.nameSnapshot || item.name || item.productName || item.product?.name || item.productId?.name || item.title || "Product Item";
    const qty = Number(item.quantity || item.billedQuantity || item.qty || 1);
    const price = Number(item.unitPrice ?? item.price ?? item.sellingPrice ?? item.product?.price ?? 0);
    const lineTotal = Number(item.lineTotal ?? item.total ?? (qty * price));
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
  const discountAmount = getDiscountAmount(billData, subtotal);
  const gstTaxAmount = Number(billData.taxAmount || billData.gstAmount || billData.tax || 0);

  // Grand Total is calculated by subtracting discount and adding tax
  const totalAmount = Math.max(0, subtotal - discountAmount + gstTaxAmount);

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

  if (discountAmount > 0) {
    figY += 4.5;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald 500
    doc.text("Discount:", summaryRightX, figY);
    doc.text(`- Rs. ${discountAmount.toFixed(2)}`, pageWidth - margin, figY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
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

  // Authorized Signatory Box Right with Official Stamp Logo positioned JUST ABOVE signature line
  const stampWidth = 28;
  const stampHeight = 28;
  const stampCenterX = pageWidth - margin - 22.5;
  const sigLineY = yPos + 18;

  try {
    // Render official rubber stamp logo image JUST ABOVE the signature line
    doc.addImage("/stamp.png", "PNG", stampCenterX - (stampWidth / 2), sigLineY - stampHeight - 1, stampWidth, stampHeight);
  } catch (imgErr) {
    console.warn("[PDF GENERATOR] Could not embed stamp image:", imgErr?.message);
  }

  yPos = sigLineY;
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - margin - 45, yPos, pageWidth - margin, yPos);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("For VyparSakha", stampCenterX, yPos + 4, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Authorized Signatory", stampCenterX, yPos + 7.5, { align: "center" });

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
  const billId = billData.billNumber || (billData._id ? String(billData._id).slice(-8) : null) || "INVOICE";
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
