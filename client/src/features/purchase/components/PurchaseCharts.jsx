"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title
);

const currencyFormat = (val) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

/**
 * Purchase Amount Trend Chart (Line / Area)
 */
export function PurchaseTrendChart({ trend = [] }) {
  if (!trend.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No trend data available</p>
      </div>
    );
  }

  const labels = trend.map((t) => t.label || t.date);
  const purchaseAmounts = trend.map((t) => t.amount || 0);
  const paidAmounts = trend.map((t) => t.paid || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Purchase Amount",
        data: purchaseAmounts,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#2563eb",
        borderWidth: 2.5,
      },
      {
        label: "Amount Paid",
        data: paidAmounts,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.08)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10b981",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          font: { weight: "600", size: 12 },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${currencyFormat(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: "600" },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(226, 232, 240, 0.6)" },
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (value) => currencyFormat(value),
        },
      },
    },
  };

  return (
    <div className="h-64 sm:h-72 w-full">
      <Line data={data} options={options} />
    </div>
  );
}

/**
 * Purchase Order Count Trend Chart (Bar)
 */
export function PurchaseOrderCountChart({ trend = [] }) {
  if (!trend.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No order data available</p>
      </div>
    );
  }

  const labels = trend.map((t) => t.label || t.date);
  const orderCounts = trend.map((t) => t.orders || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Purchase Orders",
        data: orderCounts,
        backgroundColor: "rgba(99, 102, 241, 0.85)",
        hoverBackgroundColor: "#4f46e5",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        callbacks: {
          label: (context) => `Orders: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: "600" },
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          stepSize: 1,
          precision: 0,
        },
        grid: { color: "rgba(226, 232, 240, 0.6)" },
      },
    },
  };

  return (
    <div className="h-64 sm:h-72 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}

/**
 * Top Suppliers Horizontal Bar Chart
 */
export function TopSuppliersChart({ suppliers = [] }) {
  if (!suppliers.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No supplier data available</p>
      </div>
    );
  }

  const topSuppliers = suppliers.slice(0, 7);
  const labels = topSuppliers.map((s) => s.sellerName || "Unknown");
  const values = topSuppliers.map((s) => s.totalPurchaseAmount || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Purchase Value",
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
          "#06b6d4",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        callbacks: {
          label: (context) => `Purchase: ${currencyFormat(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(226, 232, 240, 0.6)" },
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          callback: (value) => currencyFormat(value),
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#334155",
          font: { size: 11, weight: "600" },
        },
      },
    },
  };

  return (
    <div className="h-64 sm:h-72 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}

/**
 * Payment Status Breakdown Doughnut Chart
 */
export function PaymentStatusDonutChart({ paymentAnalysis }) {
  const statusAmounts = paymentAnalysis?.statusAmounts || {};
  const paid = statusAmounts.paid || 0;
  const partial = statusAmounts.partial || 0;
  const unpaid = statusAmounts.unpaid || 0;

  const total = paid + partial + unpaid;

  if (total === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm font-medium">No payment data</p>
      </div>
    );
  }

  const data = {
    labels: ["Paid", "Partial", "Unpaid"],
    datasets: [
      {
        data: [paid, partial, unpaid],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        hoverBackgroundColor: ["#059669", "#d97706", "#dc2626"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { weight: "600", size: 11 },
          color: "#475569",
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
            return ` ${context.label}: ${currencyFormat(val)} (${pct}%)`;
          },
        },
      },
    },
    cutout: "68%",
  };

  return (
    <div className="relative h-56 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
}
