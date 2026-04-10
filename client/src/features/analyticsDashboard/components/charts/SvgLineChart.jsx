'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Title);

const formatTick = (value) => Number(value || 0).toLocaleString('en-IN');

const SvgLineChart = ({ labels = [], values = [], color = '#4f46e5', height = 260 }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Trend',
        data: values,
        borderColor: color,
        backgroundColor: 'rgba(79, 70, 229, 0.14)',
        fill: true,
        tension: 0.38,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: color,
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
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="relative h-[260px] w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default SvgLineChart;
