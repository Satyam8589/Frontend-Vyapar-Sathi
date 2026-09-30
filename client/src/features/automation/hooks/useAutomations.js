"use client";

import { useCallback, useEffect, useState } from "react";
import { createAutomation, deleteAutomation, getAutomations, toggleAutomationStatus, triggerAutomationNow } from "../services/automationService";
import { showError, showSuccess } from "@/utils/toast";
import { INITIAL_FORM_DATA } from "../constants";

export default function useAutomations(storeId) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    if (!storeId) return;
    try {
      setLoading(true); setError(null); setAutomations(await getAutomations(storeId));
    } catch (err) { setError(err?.message || "Failed to load automations"); } finally { setLoading(false); }
  }, [storeId]);

  useEffect(() => { refresh(); }, [refresh]);

  const runAction = async (id, action, successMessage, errorMessage) => {
    try { setActionLoadingId(id); await action(); showSuccess(successMessage); await refresh(); }
    catch (err) { showError(err?.message || errorMessage); }
    finally { setActionLoadingId(null); }
  };

  const create = async (formData) => {
    try {
      setSubmitting(true);
      await createAutomation({ title: formData.title, store: storeId, taskType: formData.taskType, frequency: formData.frequency, time: formData.time, config: { recipientEmail: formData.recipientEmail, timeframe: formData.timeframe } });
      showSuccess("Automation rule created successfully"); await refresh(); return true;
    } catch (err) { showError(err?.message || "Failed to create automation"); return false; }
    finally { setSubmitting(false); }
  };

  const toggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    return runAction(id, () => toggleAutomationStatus(id, nextStatus), nextStatus === "ACTIVE" ? "Automation resumed" : "Automation paused", "Failed to update automation status");
  };
  const triggerNow = (id, title) => runAction(id, () => triggerAutomationNow(id), `Automation '${title}' triggered successfully`, "Trigger failed");
  const remove = (id, title) => runAction(id, () => deleteAutomation(id), `Automation '${title}' deleted`, "Delete failed");

  return { automations, loading, error, actionLoadingId, submitting, formDefaults: INITIAL_FORM_DATA, create, toggleStatus, triggerNow, remove, refresh };
}
