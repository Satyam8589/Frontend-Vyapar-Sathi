"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAgentFiles, fetchFileDownloadUrl } from "../../services/aiDashboardService";

// ─── helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Excel: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
  Word:  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  CSV:   { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
  PDF:   { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
  Text:  { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
  JSON:  { bg: "#ede9fe", text: "#6d28d9", border: "#c4b5fd" },
  File:  { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
};

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ─── sub-components ───────────────────────────────────────────────────────────

const TypeBadge = ({ type }) => {
  const c = TYPE_COLORS[type] || TYPE_COLORS.File;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: "999px",
        padding: "2px 10px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {type}
    </span>
  );
};

const DownloadButton = ({ storeId, file, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const result = await fetchFileDownloadUrl(storeId, file.storage_key);
      if (!result?.download_url) throw new Error("No URL returned");

      // Trigger browser download
      const a = document.createElement("a");
      a.href = result.download_url;
      a.download = result.filename || file.filename;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      onError?.(`Could not download "${file.filename}": ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title="Download file"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 16px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        background: loading ? "#f8fafc" : "#fff",
        color: loading ? "#94a3b8" : "#3b82f6",
        fontWeight: 700,
        fontSize: "13px",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.background = "#eff6ff";
          e.currentTarget.style.borderColor = "#93c5fd";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {loading ? (
        <>
          <svg style={{ animation: "spin 1s linear infinite", width: 14, height: 14 }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Getting link…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </>
      )}
    </button>
  );
};

const FileCard = ({ file, storeId, onError }) => (
  <article
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px 20px",
      borderRadius: "16px",
      border: "1px solid #f1f5f9",
      background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 4px 16px rgba(59,130,246,0.08)";
      e.currentTarget.style.borderColor = "#dbeafe";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      e.currentTarget.style.borderColor = "#f1f5f9";
    }}
  >
    {/* Icon */}
    <div
      style={{
        width: 44, height: 44,
        borderRadius: 12,
        background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}
    >
      {file.icon}
    </div>

    {/* Info */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 14, fontWeight: 700, color: "#1e293b",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          marginBottom: 4,
        }}
        title={file.filename}
      >
        {file.filename}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <TypeBadge type={file.file_type} />
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{file.size_label}</span>
        <span style={{ fontSize: 12, color: "#cbd5e1" }}>·</span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDate(file.last_modified)}</span>
      </div>
    </div>

    {/* Download */}
    <DownloadButton storeId={storeId} file={file} onError={onError} />
  </article>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div
    style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 20px", borderRadius: 16,
      border: "1px solid #f1f5f9", background: "#fff",
    }}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9" }} />
    <div style={{ flex: 1 }}>
      <div style={{ height: 14, width: "55%", borderRadius: 6, background: "#f1f5f9", marginBottom: 8 }} />
      <div style={{ height: 11, width: "35%", borderRadius: 6, background: "#f8fafc" }} />
    </div>
    <div style={{ height: 34, width: 100, borderRadius: 10, background: "#f1f5f9" }} />
  </div>
);

// ─── Main section ─────────────────────────────────────────────────────────────

const AgentFilesSection = ({ storeId }) => {
  const [files, setFiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [filter, setFilter] = useState("All");

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgentFiles(storeId);
      setFiles(data.files || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Could not load agent files. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => { load(); }, [load]);

  // Available filter types derived from loaded files
  const fileTypes = ["All", ...Array.from(new Set(files.map(f => f.file_type)))];
  const displayed = filter === "All" ? files : files.filter(f => f.file_type === filter);

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7c3aed", marginBottom: 6 }}>
            Agent Documents
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Generated Files
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontWeight: 500 }}>
            Excel & Word files created by your AI agent — stored securely in the cloud.
          </p>
        </div>

        <button
          onClick={load}
          disabled={loading}
          title="Refresh file list"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10,
            border: "1px solid #e2e8f0", background: "#fff",
            color: "#7c3aed", fontWeight: 700, fontSize: 13,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={loading ? { animation: "spin 1s linear infinite" } : {}}>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter pills */}
      {!loading && files.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {fileTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: "5px 14px",
                borderRadius: 999,
                border: "1px solid",
                borderColor: filter === type ? "#7c3aed" : "#e2e8f0",
                background: filter === type ? "#7c3aed" : "#fff",
                color: filter === type ? "#fff" : "#64748b",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Download error toast */}
      {downloadError && (
        <div style={{
          padding: "10px 16px", borderRadius: 10, background: "#fef2f2",
          border: "1px solid #fca5a5", color: "#b91c1c",
          fontSize: 13, fontWeight: 600, marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {downloadError}
          <button onClick={() => setDownloadError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#b91c1c", fontWeight: 900, fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{
          padding: "32px 20px", borderRadius: 20,
          border: "1px dashed #fca5a5", background: "#fef2f2",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>⚠️</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#b91c1c" }}>{error}</p>
          <button onClick={load} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 10, background: "#b91c1c", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      ) : displayed.length === 0 ? (
        <div style={{
          padding: "48px 20px", borderRadius: 20,
          border: "1px dashed #e2e8f0", background: "#fafafa",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📂</p>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
            {filter !== "All" ? `No ${filter} files yet` : "No files generated yet"}
          </p>
          <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 340, margin: "0 auto" }}>
            Ask your AI Buddy to generate a report — Excel or Word files will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>
            {displayed.length} file{displayed.length !== 1 ? "s" : ""}{filter !== "All" ? ` · ${filter}` : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {displayed.map(file => (
              <FileCard
                key={file.storage_key}
                file={file}
                storeId={storeId}
                onError={setDownloadError}
              />
            ))}
          </div>
        </>
      )}

      {/* spin keyframes injected once */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

export default AgentFilesSection;
