import { apiGet, apiPost, apiPatch, apiDelete } from "@/servies/api";

/**
 * Automation Service - API helper methods for user-scheduled automations
 */

// Fetch all scheduled automations for a store
export const getAutomations = async (storeId) => {
  try {
    const url = storeId ? `/automations?storeId=${storeId}` : "/automations";
    const response = await apiGet(url);
    return response.automations || response.data || [];
  } catch (error) {
    console.error("Failed to fetch automations:", error);
    throw error;
  }
};

// Create a new scheduled automation
export const createAutomation = async (data) => {
  try {
    const response = await apiPost("/automations", data);
    return response.automation || response.data;
  } catch (error) {
    console.error("Failed to create automation:", error);
    throw error;
  }
};

// Pause or Resume an automation (status = 'ACTIVE' | 'PAUSED')
export const toggleAutomationStatus = async (id, status) => {
  try {
    const response = await apiPatch(`/automations/${id}/status`, { status });
    return response.automation || response.data;
  } catch (error) {
    console.error("Failed to update automation status:", error);
    throw error;
  }
};

// Immediately execute an automation out of schedule
export const triggerAutomationNow = async (id) => {
  try {
    const response = await apiPost(`/automations/${id}/trigger-now`);
    return response;
  } catch (error) {
    console.error("Failed to trigger automation:", error);
    throw error;
  }
};

// Delete an automation
export const deleteAutomation = async (id) => {
  try {
    const response = await apiDelete(`/automations/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to delete automation:", error);
    throw error;
  }
};
