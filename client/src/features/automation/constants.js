export const TASK_TYPES = {
  LOW_STOCK_ALERT: { label: "Low stock email alert", description: "Notify your team when inventory needs attention.", icon: "mail", tone: "amber" },
  SALES_SUMMARY: { label: "Sales summary report", description: "Send a scheduled snapshot of store performance.", icon: "chart", tone: "emerald" },
  AI_DEMAND_FORECAST: { label: "AI demand forecast", description: "Generate demand insights for upcoming inventory planning.", icon: "bot", tone: "violet" },
  EXCEL_REPORT_EXPORT: { label: "Excel report export", description: "Export a fresh inventory report on schedule.", icon: "sheet", tone: "blue" },
};

export const INITIAL_FORM_DATA = { title: "", taskType: "LOW_STOCK_ALERT", frequency: "DAILY", time: "09:00", recipientEmail: "", timeframe: "30d" };

export const getTaskDetails = (taskType) => TASK_TYPES[taskType] || { label: taskType, description: "Scheduled store automation.", icon: "zap", tone: "slate" };
