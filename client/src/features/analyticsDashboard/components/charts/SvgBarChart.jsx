'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

const formatTick = (value) => Number(value || 0).toLocaleString('en-IN');

const SvgBarChart = ({ labels = [], values = [], color = '#0f172a', accent = '#4f46e5', height = 280 }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        borderRadius: 16,
        borderSkipped: false,
        backgroundColor: accent,
        hoverBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            weight: '700',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.18)',
        },
        ticks: {
          color: '#64748b',
          callback: formatTick,
        },
      },
    },
  };

  return (
    <div className="relative h-[280px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SvgBarChart;
