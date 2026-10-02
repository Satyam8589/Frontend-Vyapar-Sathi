"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { analyzeBulkHeaders, executeBulkUpload } from "../services/inventoryService";
import toast from "react-hot-toast";

const TARGET_FIELDS = [
  { key: "name", label: "Product Name *", required: true },
  { key: "barcode", label: "Barcode / SKU / EAN", required: false },
  { key: "quantity", label: "Stock Quantity", required: false },
  { key: "sellingPrice", label: "Selling Price / Rate", required: false },
  { key: "buyingPrice", label: "Buying Price", required: false },
  { key: "category", label: "Category", required: false },
  { key: "unit", label: "Unit (e.g. Pcs, Kg)", required: false },
  { key: "brand", label: "Brand Name", required: false },
  { key: "expDate", label: "Expiry Date", required: false },
];

export default function BulkUploadModal({ isOpen, onClose, storeId, onUploadSuccess }) {
  const [step, setStep] = useState("select"); // select | analyzing | mapping | processing | result
  const [fileData, setFileData] = useState({ name: "", headers: [], rows: [], sampleRows: [] });
  const [mapping, setMapping] = useState({});
  const [stockUpdateMode, setStockUpdateMode] = useState("add"); // add | replace
  const [aiSource, setAiSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: "array", cellDates: true, dateNF: "yyyy-mm-dd" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert to JSON array of objects with formatted dates
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: "", cellDates: true, dateNF: "yyyy-mm-dd" });
        
        if (!rawJson || rawJson.length === 0) {
          toast.error("The uploaded Excel file appears to be empty.");
          return;
        }

        const headers = Object.keys(rawJson[0]);
        const sampleRows = rawJson.slice(0, 3);

        setFileData({
          name: file.name,
          headers,
          rows: rawJson,
          sampleRows,
        });

        startAiAnalysis(headers, sampleRows);
      } catch (err) {
        console.error("Excel parse error:", err);
        toast.error("Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const startAiAnalysis = async (headers, sampleRows) => {
    setStep("analyzing");
    setLoading(true);
    try {
      const response = await analyzeBulkHeaders(headers, sampleRows);
      const { mapping: aiMapping, source } = response.data;

      setMapping(aiMapping || {});
      setAiSource(source);
      setStep("mapping");
    } catch (err) {
      console.error("AI Mapping failed:", err);
      toast.error("AI column mapping failed, using default auto-match.");
      // Fallback matching
      const defaultMapping = {};
      headers.forEach((h) => {
        const lower = h.toLowerCase();
        if (/name|product/i.test(lower)) defaultMapping.name = h;
        if (/code|barcode|sku/i.test(lower)) defaultMapping.barcode = h;
        if (/cat|category/i.test(lower)) defaultMapping.category = h;
        if (/cost|buying|purchase/i.test(lower)) defaultMapping.buyingPrice = h;
        if (/price|rate|mrp|selling/i.test(lower) && !/cost|buying|purchase/i.test(lower)) defaultMapping.sellingPrice = h;
        if (/qty|quantity|stock/i.test(lower)) defaultMapping.quantity = h;
        if (/unit/i.test(lower)) defaultMapping.unit = h;
        if (/brand/i.test(lower)) defaultMapping.brand = h;
      });
      setMapping(defaultMapping);
      setStep("mapping");
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (fieldKey, selectedHeader) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: selectedHeader || null,
    }));
  };

  const handleExecuteUpload = async () => {
    // Validate required mappings
    if (!mapping.name) {
      toast.error("Please map the required field: Product Name.");
      return;
    }

    setStep("processing");
    setLoading(true);

    try {
      const response = await executeBulkUpload({
        storeId,
        rows: fileData.rows,
        columnMapping: mapping,
        stockUpdateMode,
      });

      const resData = response.data;
      setUploadResult(resData);
      setStep("result");
      toast.success("Bulk product import complete!");

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Bulk upload execution failed:", err);
      toast.error(err.response?.data?.message || "Failed to process bulk upload.");
      setStep("mapping");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("select");
    setFileData({ name: "", headers: [], rows: [], sampleRows: [] });
    setMapping({});
    setStockUpdateMode("add");
    setUploadResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Bulk Upload Products (Excel)</h2>
              <p className="text-xs text-blue-100">AI-Powered Gemini Column Matching & Global Store Sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select File */}
          {step === "select" && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-10 hover:border-blue-500 transition-colors bg-slate-50/50 text-center">
              <svg className="w-16 h-16 text-blue-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Upload Inventory Excel File</h3>
              <p className="text-xs text-slate-500 mb-6 max-w-md">
                Upload your stock file (.xlsx, .csv). Our Gemini AI engine will automatically match your Excel columns with Vyapar Sathi form fields.
              </p>
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Choose Excel / CSV File
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          )}

          {/* STEP 2: AI Analyzing */}
          {step === "analyzing" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 relative mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-indigo-200 border-b-indigo-600 animate-spin-slow"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Analyzing Excel Columns with Gemini AI...</h3>
              <p className="text-xs text-slate-500">Matching {fileData.headers.length} headers across {fileData.rows.length} rows</p>
            </div>
          )}

          {/* STEP 3: Mapping Verification */}
          {step === "mapping" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-xs text-blue-800 gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {aiSource === "gemini_ai" ? "Gemini AI Mapped" : "Auto-Matched"}
                  </span>
                  <span>Review & confirm column mappings before importing.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300">
                    {TARGET_FIELDS.filter((f) => Boolean(mapping[f.key])).length} Updating
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-300">
                    {TARGET_FIELDS.filter((f) => !mapping[f.key]).length} Ignored
                  </span>
                </div>
              </div>

              {/* Stock Update Mode Selector */}
              <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Existing Product Stock Behavior</span>
                  <span className="text-[10px] text-slate-500">Choose how to update quantity if product already exists</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setStockUpdateMode("add")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      stockUpdateMode === "add" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    ➕ Add to Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockUpdateMode("replace")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      stockUpdateMode === "replace" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🔄 Replace / Set Stock
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {TARGET_FIELDS.map((field) => {
                  const isMapped = Boolean(mapping[field.key]);
                  return (
                    <div
                      key={field.key}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all gap-2 ${
                        isMapped
                          ? "bg-emerald-50/40 border-emerald-200"
                          : "bg-amber-50/60 border-dashed border-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {field.label}
                            </span>
                            {isMapped ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ✓ Updating
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                ⚠️ Ignored (Preserved)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {isMapped
                              ? "Will update from Excel column"
                              : "Will NOT overwrite existing product value"}
                          </span>
                        </div>
                      </div>

                      <div className="sm:w-64">
                        <select
                          value={mapping[field.key] || ""}
                          onChange={(e) => handleMappingChange(field.key, e.target.value)}
                          className={`w-full text-xs font-semibold rounded-lg p-2 outline-none border transition-all ${
                            isMapped
                              ? "bg-white border-emerald-300 text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                              : "bg-amber-50/70 border-amber-300 text-amber-900 focus:ring-2 focus:ring-amber-500"
                          }`}
                        >
                          <option value="">-- Ignore / Unmapped --</option>
                          {fileData.headers.map((h) => (
                            <option key={h} value={h}>
                              Excel Column: {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sample Preview Table */}
              {fileData.sampleRows.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Sample Data Preview (First 3 Rows)</h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          {fileData.headers.map((h) => (
                            <th key={h} className="p-2 border-b border-slate-200 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.sampleRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            {fileData.headers.map((h) => (
                              <td key={h} className="p-2 whitespace-nowrap text-slate-600">{String(row[h] ?? "")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Importing Products...</h3>
              <p className="text-xs text-slate-500">Checking Global Store catalog and local inventory</p>
            </div>
          )}

          {/* STEP 5: Result Summary */}
          {step === "result" && uploadResult && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-1">Bulk Processing Completed!</h3>
                <p className="text-xs text-emerald-700">All rows processed with dual Global & Store sync</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-xs text-slate-500 block">New Added</span>
                    <span className="text-lg font-black text-emerald-600">{uploadResult.success}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-xs text-slate-500 block">Stock Updated</span>
                    <span className="text-lg font-black text-blue-600">{uploadResult.updated}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-xs text-slate-500 block">Global Master Synced</span>
                    <span className="text-lg font-black text-purple-600">{uploadResult.masterAdded}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="text-xs text-slate-500 block">Failed / Skipped</span>
                    <span className="text-lg font-black text-rose-600">{uploadResult.failed}</span>
                  </div>
                </div>
              </div>

              {/* Errors section */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="border border-rose-200 bg-rose-50/50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-rose-800 mb-2">Skipped / Failed Rows ({uploadResult.errors.length})</h4>
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {uploadResult.errors.map((err, i) => (
                      <div key={i} className="text-[11px] text-rose-700 flex justify-between">
                        <span>Row {err.rowNumber}: {err.product || "Unknown product"}</span>
                        <span className="font-semibold">{err.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={step === "result" ? handleReset : onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            {step === "result" ? "Upload Another File" : "Cancel"}
          </button>

          {step === "mapping" && (
            <button
              onClick={handleExecuteUpload}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              Confirm & Upload {fileData.rows.length} Products
            </button>
          )}

          {step === "result" && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Done & Refresh Inventory
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
