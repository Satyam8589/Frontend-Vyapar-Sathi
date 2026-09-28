"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Zap,
  Plus,
  Clock,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Mail,
  FileSpreadsheet,
  BarChart3,
  Bot,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import {
  getAutomations,
  createAutomation,
  toggleAutomationStatus,
  triggerAutomationNow,
  deleteAutomation,
} from "@/features/automation/services/automationService";

export default function AutomationsPage() {
  const params = useParams();
  const storeId = params?.storeId;

  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // New Automation Form State
  const [formData, setFormData] = useState({
    title: "",
    taskType: "LOW_STOCK_ALERT",
    frequency: "DAILY",
    time: "09:00",
    recipientEmail: "",
    timeframe: "30d",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch automations for current store
  const fetchAutomations = useCallback(async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAutomations(storeId);
      setAutomations(data);
    } catch (err) {
      setError(err?.message || "Failed to load automations");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Handle Form Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createAutomation({
        title: formData.title,
        store: storeId,
        taskType: formData.taskType,
        frequency: formData.frequency,
        time: formData.time,
        config: {
          recipientEmail: formData.recipientEmail,
          timeframe: formData.timeframe,
        },
      });

      setIsModalOpen(false);
      setFormData({
        title: "",
        taskType: "LOW_STOCK_ALERT",
        frequency: "DAILY",
        time: "09:00",
        recipientEmail: "",
        timeframe: "30d",
      });
      showNotification("✨ Automation rule created successfully!");
      fetchAutomations();
    } catch (err) {
      alert(`Error creating automation: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Toggle Status (Active / Paused)
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      setActionLoadingId(id);
      await toggleAutomationStatus(id, newStatus);
      showNotification(
        newStatus === "ACTIVE" ? "▶️ Automation resumed" : "⏸️ Automation paused"
      );
      fetchAutomations();
    } catch (err) {
      alert(`Failed to update status: ${err.message || err}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Immediate Execution
  const handleTriggerNow = async (id, title) => {
    try {
      setActionLoadingId(id);
      await triggerAutomationNow(id);
      showNotification(`🚀 Automation '${title}' triggered successfully!`);
      fetchAutomations();
    } catch (err) {
      alert(`Trigger failed: ${err.message || err}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      setActionLoadingId(id);
      await deleteAutomation(id);
      showNotification("🗑️ Automation deleted");
      fetchAutomations();
    } catch (err) {
      alert(`Delete failed: ${err.message || err}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Task Icon & Badge Helper
  const getTaskDetails = (taskType) => {
    switch (taskType) {
      case "LOW_STOCK_ALERT":
        return {
          icon: <Mail className="w-5 h-5 text-amber-400" />,
          label: "Low Stock Email Alert",
          badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        };
      case "SALES_SUMMARY":
        return {
          icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
          label: "Sales Summary Report",
          badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        };
      case "AI_DEMAND_FORECAST":
        return {
          icon: <Bot className="w-5 h-5 text-purple-400" />,
          label: "AI Demand Forecast",
          badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        };
      case "EXCEL_REPORT_EXPORT":
        return {
          icon: <FileSpreadsheet className="w-5 h-5 text-blue-400" />,
          label: "Excel Report Export",
          badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        };
      default:
        return {
          icon: <Zap className="w-5 h-5 text-indigo-400" />,
          label: taskType,
          badgeBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
        };
    }
  };

  const activeCount = automations.filter((a) => a.status === "ACTIVE").length;
  const totalRuns = automations.reduce((acc, a) => acc + (a.runCount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen text-slate-100">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Scheduled Automations
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Set up automated daily stock alerts, email sales summaries, and AI demand forecasting jobs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Automation</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Active Rules
            </p>
            <p className="text-3xl font-black text-white">{activeCount}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Executions
            </p>
            <p className="text-3xl font-black text-white">{totalRuns}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Engine Status
            </p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              BullMQ & Redis Active
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-400 font-medium">Loading automation rules...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl flex items-center gap-3 text-red-400 mb-6">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && automations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
          <div className="p-4 bg-blue-500/10 text-blue-400 rounded-full mb-4">
            <Zap className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Automations Configured</h3>
          <p className="text-slate-400 max-w-md mb-6 text-sm">
            Create automated tasks to monitor your inventory, send email sales digests, or generate AI forecasts on schedule.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Automation</span>
          </button>
        </div>
      )}

      {/* Automations Grid */}
      {!loading && automations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {automations.map((item) => {
            const taskInfo = getTaskDetails(item.taskType);
            const isLoading = actionLoadingId === item._id;

            return (
              <div
                key={item._id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Icon + Status Switch */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                        {taskInfo.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white leading-snug">
                          {item.title}
                        </h3>
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1 ${taskInfo.badgeBg}`}
                        >
                          {taskInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Status Toggle Button */}
                    <button
                      onClick={() => handleToggleStatus(item._id, item.status)}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                      }`}
                    >
                      {item.status === "ACTIVE" ? (
                        <>
                          <Play className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Paused
                        </>
                      )}
                    </button>
                  </div>

                  {/* Config & Schedule Details */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs space-y-2 mb-4 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" /> Frequency:
                      </span>
                      <span className="font-semibold text-white">
                        {item.frequency} {item.time ? `@ ${item.time}` : ""}
                      </span>
                    </div>

                    {item.cronExpression && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" /> Cron Pattern:
                        </span>
                        <code className="bg-slate-800 px-2 py-0.5 rounded text-purple-300 font-mono">
                          {item.cronExpression}
                        </code>
                      </div>
                    )}

                    {item.config?.recipientEmail && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-amber-400" /> Recipient:
                        </span>
                        <span className="font-medium text-amber-200">
                          {item.config.recipientEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls & Stats */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span>Runs: <strong className="text-white">{item.runCount || 0}</strong></span>
                    {item.lastRunAt && (
                      <span className="ml-3 text-slate-500">
                        Last: {new Date(item.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Trigger Now Button */}
                    <button
                      onClick={() => handleTriggerNow(item._id, item.title)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-xl font-semibold transition-all"
                      title="Run immediately"
                    >
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Run Now</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      disabled={isLoading}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all"
                      title="Delete automation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE AUTOMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">
                  Schedule New Automation
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Automation Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Morning Stock Email"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Automation Action / Task
                </label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="LOW_STOCK_ALERT">📦 Low Stock Email Alert</option>
                  <option value="SALES_SUMMARY">📊 Daily Sales Summary Email</option>
                  <option value="AI_DEMAND_FORECAST">🤖 AI Demand Forecast Trigger</option>
                  <option value="EXCEL_REPORT_EXPORT">📄 Excel Inventory Export</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly (Mondays)</option>
                    <option value="MONTHLY">Monthly (1st of month)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Time (HH:mm)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {(formData.taskType === "LOW_STOCK_ALERT" || formData.taskType === "SALES_SUMMARY") && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="storeowner@example.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Schedule Automation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
