export const formatDate = (
  value,
  options = { day: "numeric", month: "short", year: "numeric" },
) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-IN", options);
};

export const formatCurrency = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export const createDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (days - 1));

  const toQueryDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return { startDate: toQueryDate(startDate), endDate: toQueryDate(endDate) };
};

export const getComparisonLabel = (comparison) => {
  if (!comparison || comparison.percentageChange === null) {
    return "No previous data";
  }

  const change = Number(comparison.percentageChange || 0);
  return `${change >= 0 ? "+" : ""}${change}% vs previous period`;
};
